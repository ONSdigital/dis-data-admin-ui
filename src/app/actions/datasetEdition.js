"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { httpPost, httpPut, SSRequestConfig } from "@/utils/request/request";
import { logInfo } from "@/utils/log/log";
import { getFormData as getEditionWithVersionFormData, handleFailedValidation as handleWithVersionFailedValidation } from "./datasetVersion";

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
    distributions: z.array(z.object({
        download_url: z.string(),
    })).min(1, { message: "A file upload is required" })
});

const doSubmission = async (datasetEditionSubmission, makeRequest) => {
    const actionResponse = {};
    const reqCfg = await SSRequestConfig(cookies);

    const datasetID = datasetEditionSubmission.dataset_id;
    const editionID = datasetEditionSubmission.edition_id || datasetEditionSubmission.edition;

    let url = `/datasets/${datasetID}/editions/${editionID}/versions`;
    if (datasetEditionSubmission.edition_id) { url = url + `/1`; }

    try {
        const data = await makeRequest(reqCfg, url, datasetEditionSubmission);
        actionResponse.success = true;
        if (data.status >= 400) {
            actionResponse.success = false;
            actionResponse.code = data.status;

            const errorMessage = JSON.parse(data.errorMessage);
            if (errorMessage.errors[0].code === "ErrVersionAlreadyExists") {
                actionResponse.httpError = `A edition with this ID already exists within this series`;
            } else if (errorMessage.errors[0].code === "ErrEditionTitleAlreadyExists") {
                actionResponse.httpError = `A edition with this Title already exists within this series`;
            }
            return actionResponse;
        }
        logInfo("saved dataset edition successfully", null, null);
    } catch (err) {
        return err.toString();
    }
    
    if (actionResponse.success === true) {
        redirect(`/series/${datasetID}/editions/${datasetEditionSubmission.edition}?display_success=true`);
    }

    return actionResponse;
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
    const datasetEditionSubmission = getEditionWithVersionFormData(formData);
    const validation = editionWithVersionSchema.safeParse(datasetEditionSubmission);

    if (!validation.success) {
        return handleWithVersionFailedValidation(validation, datasetEditionSubmission);
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
