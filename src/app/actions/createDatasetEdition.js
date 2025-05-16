"use server";

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";
import { logInfo } from "@/utils/log/log";

import { z } from "zod";
 
const editionSchema = z.object({
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

export async function createDatasetEdition(currentstate, formData) {
    let actionResponse = {};

    const datasetID = formData.get("dataset-id");
    const usageNotes = formData.getAll("usage-notes");
    const parsedUsageNotes = [];
    usageNotes.map(note => {
        parsedUsageNotes.push(JSON.parse(note));
    });
    const alerts = formData.getAll("alerts");
    const parsedAlerts = [];
    alerts.map(alert => {
        parsedAlerts.push(JSON.parse(alert));
    });
    const datasetEdition = {
        edition: formData.get("edition-id"),
        edition_title: formData.get("edition-title"),
        quality_designation: formData.get("quality-desingation-value"),
        release_day: formData.get("release-date-day"),
        release_month: formData.get("release-date-month"),
        release_year: formData.get("release-date-year"),
        release_hour: formData.get("release-date-hour"),
        release_minutes: formData.get("release-date-minutes"),
        usage_notes: parsedUsageNotes,
        alerts: parsedAlerts,
        distributions: [ JSON.parse(formData.get('dataset-upload-value')) ],
        release_date: null,
    };

    const validation = editionSchema.safeParse(datasetEdition);

    if (!validation.success) {
        actionResponse.success = validation.success;
        actionResponse.errors = validation.error.flatten().fieldErrors;
        actionResponse.errors = addUploadFileErrorMessage(actionResponse.errors);
        actionResponse.errors = mergeDateTimeErrors(actionResponse.errors);
        actionResponse.submission = datasetEdition;
        logInfo("failed dataset edition validation", null, null);
        return actionResponse;
    } 

    datasetEdition.release_date =  new Date(datasetEdition.release_year, datasetEdition.release_month - 1, datasetEdition.release_day, datasetEdition.release_hour, datasetEdition.release_minutes).toISOString();

    const reqCfg = await SSRequestConfig(cookies);
    try {
        const data = await httpPost(reqCfg, `/datasets/${datasetID}/editions/${datasetEdition.edition}/versions`, datasetEdition);
        actionResponse.success = true;
        if (data.status >= 400) {
            actionResponse.success = false;
            actionResponse.code = data.status;
            return;
        } 
        logInfo("created dataset edition successfully", null, null);
    } catch (err) {
        return err.toString();
    }

    return actionResponse;
}
