'use server'

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";

import { z } from "zod";
 
const editionSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    quality_designation: z.string().min(1, { message: "Quality designation is required" }),
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
    return errors
}

export async function createDatasetEdition(currentstate, formData) {
    let actionResponse = {};

    const datasetID = formData.get("datasetID");
    const usageNotes = formData.getAll("usageNotes");
    const parsedUsageNotes = usageNotes.map(note => {
        return JSON.parse(note);
    })
    const alerts = formData.getAll("alerts");
    const parsedAlerts = alerts.map(alert => {
        return JSON.parse(alert);
    })
    const datasetEdition = {
        title: formData.get("editionID"),
        quality_designation: formData.get("qualityDesingationValue"),
        usage_notes: parsedUsageNotes,
        alerts: parsedAlerts,
        distributions: [ JSON.parse(formData.get('dataset-upload-value')) ],
        release_date: "hello"
    };

    console.log(datasetEdition);

    const validationResult = editionSchema.safeParse(datasetEdition)
    actionResponse.success = validationResult.success

    if (!actionResponse.success) {
        actionResponse.errors = validationResult.error.flatten().fieldErrors;
        actionResponse.errors = addUploadFileErrorMessage(actionResponse.errors)
        actionResponse.submission = datasetEdition;
    } else {
        const reqCfg = await SSRequestConfig(cookies);
        try {
            const data = await httpPost(reqCfg, `/datasets/${datasetID}/editions/${datasetEdition.title}/versions`, datasetEdition);
            if (data.status >= 400) {
                actionResponse.success = false;
                actionResponse.recentlySumbitted = false;
                actionResponse.code = data.status;
            } else {
                actionResponse.recentlySumbitted = true;
            }
        } catch (err) {
            return err.toString();
        }
    }
    return actionResponse;
}
