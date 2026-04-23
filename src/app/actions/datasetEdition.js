"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { httpPost, httpPut, SSRequestConfig } from "@/utils/request/request";
import { logError, logInfo } from "@/utils/log/log";
import { getFormData as getEditionWithVersionFormData, handleFailedValidation as handleWithVersionFailedValidation, updateDistributionsMetadata } from "./datasetVersion";

import { z } from "zod";
 
const editionSchema = z.object({
    edition: z.string().min(1, { message: "Edition ID is required" }),
    edition_title: z.string().min(1, { message: "Edition title is required" })
});

const editionWithVersionSchema = z.object({
    edition: z.string().min(1, { message: "Edition ID is required" }),
    edition_title: z.string().min(1, { message: "Edition title is required" }),
    quality_designation: z.string().min(1, { message: "Quality designation is required" }),
    release_day: z.string().min(1, { message: "Day is required" }),
    release_month: z.string().min(1, { message: "Month is required" }),
    release_year: z.string().min(1, { message: "Year is required" }),
    release_hour: z.string().min(1, { message: "Hour is required" }),
    release_minutes: z.string().min(1, { message: "Minutes are required" }),
    release_date: z.string().min(1, { message: "A release time and date is required" }),
    distributions: z.array(z.object({
        download_url: z.string(),
    })).min(1, { message: "A file upload is required" })
});

const doSubmission = async (datasetEditionSubmission, makeRequest) => {
    const reqCfg = await SSRequestConfig(cookies);

    const datasetID = datasetEditionSubmission.dataset_id;
    const editionID = datasetEditionSubmission.edition_id || datasetEditionSubmission.edition;

    let url = `/datasets/${datasetID}/editions/${editionID}/versions`;
    if (datasetEditionSubmission.edition_id) { url = url + `/1`; }

    let editionResponse = {};
    try {
        editionResponse = await makeRequest(reqCfg, url, datasetEditionSubmission);
        if (editionResponse.status >= 400) {
            const errorMessage = JSON.parse(editionResponse.errorMessage);
            let httpError;
            if (errorMessage.errors[0].code === "ErrVersionAlreadyExists") {
                httpError = "A edition with this ID already exists within this series";
            } else if (errorMessage.errors[0].code === "ErrEditionTitleAlreadyExists") {
                httpError = "A edition with this Title already exists within this series";
            }
            return { success: false, code: editionResponse.status, httpError };
        }
        logInfo("saved dataset edition successfully", null, null);
    } catch (err) {
        logError("error saving dataset edition", null, null, err);
        return { success: false, code: 500 };
    }

    try {
        const distributionUpdateResponse = await updateDistributionsMetadata(
            reqCfg,
            editionResponse.distributions,
            datasetEditionSubmission.dataset_id,
            datasetEditionSubmission.edition,
            1
        );
        if (!distributionUpdateResponse.success) {
            logError("one or more file metadata updates failed", distributionUpdateResponse.failures, null);
            return {
                success: false,
                code: 500,
                httpError: "Failed to update file metadata. Please raise a support issue through Slack.",
            };
        }
        logInfo("successfully updated file metadata for distributions");
    } catch (err) {
        logError("error updating file metadata", null, null, err);
        return {
            success: false,
            code: 500,
            httpError: "Failed to update file metadata. Please raise a support issue through Slack.",
        };
    }

    redirect(`/series/${datasetID}/editions/${datasetEditionSubmission.edition}?display_success=true`);
};

const getFormData = (formData) => {
    return {
        dataset_id: formData.get("dataset-id"),
        edition_id: formData.get("current-edition-id"),
        edition: formData.get("edition-id"),
        edition_title: formData.get("edition-title"),
        type: "static",
    };
};

const handleFailedValidation = (validation, datasetEditionSubmission) => {
    const actionResponse = {};
    actionResponse.success = validation.success;
    actionResponse.errors = validation.error.flatten().fieldErrors;
    actionResponse.submission = datasetEditionSubmission;
    logInfo("failed dataset edition validation", null, null);
    return actionResponse;
};

const createDatasetEdition = async (currentstate, formData) => {
    const datasetEditionSubmission = await getEditionWithVersionFormData(formData);
    const validation = editionWithVersionSchema.safeParse(datasetEditionSubmission);

    if (!validation.success) {
        return await handleWithVersionFailedValidation(validation, datasetEditionSubmission);
    }
    return doSubmission(datasetEditionSubmission, httpPost);
};

const updateDatasetEdition = async (currentstate, formData) => {
    const datasetEditionSubmission = getFormData(formData);
    const validation = editionSchema.safeParse(datasetEditionSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetEditionSubmission);
    }
    return doSubmission(datasetEditionSubmission, httpPut);
};

export { createDatasetEdition, updateDatasetEdition };
