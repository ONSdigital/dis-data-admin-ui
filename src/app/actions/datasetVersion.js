"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { httpPost, httpPut, SSRequestConfig } from "@/utils/request/request";
import { logInfo } from "@/utils/log/log";

import { z } from "zod";
 
const versionSchema = z.object({
    quality_designation: z.string().min(1, { message: "Quality designation is required" }),
    release_day: z.string().min(1, { message: "Day is required" }),
    release_month: z.string().min(1, { message: "Month is required" }),
    release_year: z.string().min(1, { message: "Year is required" }),
    release_hour: z.string().min(1, { message: "Hour is required" }),
    release_minutes: z.string().min(1, { message: "Minutes are required" }),
    distributions: z.array(z.object({
        download_url: z.string().min(1, { message: "A file upload is required" }),
    })).min(1, { message: "A file upload is required" })
});

// check for an error on distrubution and update error message
// zod replies with "Required" for objects
const addUploadFileErrorMessage = (errors) => {
    if (!errors) {
        return;
    } 
    if (errors.distributions) {
        errors.distributions = ["File upload is required"];
    }
    return errors;
};

// check if any release date or time errors exists and merge them into one for time and date fieldset
const mergeDateTimeErrors = (errors) => {
    if (!errors) {
        return;
    } 
    if (errors.release_day || errors.release_month || errors.release_year || errors.release_hour || errors.release_minutes) {
        errors.release_date_time = ["A release time and date is required"];
    }
    return errors;
};

// check and parse "MultiContent" (e.g. alerts and usuage notes) fields 
const parseMutliContentField = (multiItem) => {
    if (!multiItem || !multiItem.length) return [];

    const parsedItems = [];
    multiItem.forEach(item => {
        const parsed = JSON.parse(item);
        if (parsed.type && parsed.description || parsed.title) {
            parsedItems.push(parsed);
        }
    });
    return parsedItems;
};

const doSubmission = async (datasetVersionSubmission, makeRequest) => {
    const actionResponse = {};
    const reqCfg = await SSRequestConfig(cookies);

    let url = `/datasets/${datasetVersionSubmission.dataset_id}/editions/${datasetVersionSubmission.edition}/versions`;
    if (datasetVersionSubmission.version_id) { url = url + `/${datasetVersionSubmission.version_id}`; }

    let data = {};
    try {
        data = await makeRequest(reqCfg, url, datasetVersionSubmission);
        actionResponse.success = true;
        if (data.status >= 400) {
            actionResponse.success = false;
            actionResponse.code = data.status;
            return actionResponse;
        }
        logInfo("created dataset version successfully", null, null);
    } catch (err) {
        return err.toString();
    }
    if (actionResponse.success == true) {
        const versionID = data.version || datasetVersionSubmission.version_id;
        redirect("/series/" + datasetVersionSubmission.dataset_id + "/editions/" + datasetVersionSubmission.edition + "/versions/" + versionID + "?display_success=true");
    }
    return actionResponse;
};

const getFormData = (formData) => {
    const usageNotes = formData.getAll("usage-notes");
    const parsedUsageNotes = parseMutliContentField(usageNotes);
    const alerts = formData.getAll("alerts");
    const parsedAlerts = parseMutliContentField(alerts);
    const datasetVersion = {
        dataset_id: formData.get("dataset-id"),
        edition: formData.get("edition-id"),
        version_id: formData.get("version-id"),
        edition_title: formData.get("edition-title"),
        quality_designation: formData.get("quality-designation-value"),
        release_day: formData.get("release-date-day"),
        release_month: formData.get("release-date-month"),
        release_year: formData.get("release-date-year"),
        release_hour: formData.get("release-date-hour"),
        release_minutes: formData.get("release-date-minutes"),
        usage_notes: parsedUsageNotes,
        alerts: parsedAlerts,
        distributions: JSON.parse(formData.get("dataset-upload-value")),
        release_date: null,
        type: "static",
    };

    datasetVersion.release_date =  new Date(datasetVersion.release_year, datasetVersion.release_month - 1, datasetVersion.release_day, datasetVersion.release_hour, datasetVersion.release_minutes).toISOString();
    return datasetVersion;
};

const handleFailedValidation = (validation, datasetVersionSubmission) => {
    const actionResponse = {};
    actionResponse.success = validation.success;
    actionResponse.errors = validation.error.flatten().fieldErrors;
    actionResponse.errors = addUploadFileErrorMessage(actionResponse.errors);
    actionResponse.errors = mergeDateTimeErrors(actionResponse.errors);
    actionResponse.submission = datasetVersionSubmission;
    logInfo("failed dataset version validation", null, null);
    return actionResponse;
};

const createDatasetVersion = async (currentstate, formData) => {
    const datasetVersionSubmission = getFormData(formData);
    const validation = versionSchema.safeParse(datasetVersionSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetVersionSubmission);
    }
    return doSubmission(datasetVersionSubmission, httpPost);
};

const updateDatasetVersion = async (currentstate, formData) => {
    const datasetVersionSubmission = getFormData(formData);
    const validation = versionSchema.safeParse(datasetVersionSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetVersionSubmission);
    }
    return doSubmission(datasetVersionSubmission, httpPut);
};

export { createDatasetVersion, updateDatasetVersion, getFormData, handleFailedValidation };
