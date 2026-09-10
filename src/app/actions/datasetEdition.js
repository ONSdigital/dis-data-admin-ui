"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createVersion, updateVersion } from "@/utils/request/api-clients/datasets";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";
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

const doSubmission = async (datasetEditionSubmission, doRequest) => {
    const accessToken = await getAccessTokenFromCookie(cookies);
    const datasetID = datasetEditionSubmission.dataset_id;

    let editionResponse = {};
    try {
        editionResponse = await doRequest(accessToken);
        if (editionResponse.status >= 400) {
            let httpError;
            if (editionResponse.error?.code === "ErrVersionAlreadyExists") {
                httpError = "A edition with this ID already exists within this series";
            } else if (editionResponse.error?.code === "ErrEditionTitleAlreadyExists") {
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
            accessToken,
            editionResponse.response?.distributions,
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
    const datasetID = datasetEditionSubmission.dataset_id;
    const editionID = datasetEditionSubmission.edition;
    return doSubmission(
        datasetEditionSubmission,
        (token) => createVersion(datasetID, editionID, datasetEditionSubmission, token)
    );
};

const updateDatasetEdition = async (currentstate, formData) => {
    const datasetEditionSubmission = getFormData(formData);
    const validation = editionSchema.safeParse(datasetEditionSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetEditionSubmission);
    }
    const datasetID = datasetEditionSubmission.dataset_id;
    const editionID = datasetEditionSubmission.edition_id || datasetEditionSubmission.edition;
    return doSubmission(
        datasetEditionSubmission,
        (token) => updateVersion(datasetID, editionID, 1, datasetEditionSubmission, token)
    );
};

export { createDatasetEdition, updateDatasetEdition };
