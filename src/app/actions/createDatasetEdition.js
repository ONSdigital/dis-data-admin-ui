'use server'

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";

import { z } from "zod";
 
const editionSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    quality_designation: z.string().min(1, { message: "Quality designation is required" }),
    distributions: z.object({
        download_url: z.string().min(1, { message: "A file is required" }),
    }).required({ message: "A file is required" })
});

export async function createDatasetEdition(currentstate, formData) {
    let response = {};

    const datasetEdition = {
        title: formData.get("editionID"),
        quality_designation: formData.get("qualityDesingationValue"),
        usage_notes: formData.getAll("usageNotes"),
        alerts: formData.getAll("alerts"),
        distributions: JSON.parse(formData.get('dataset-upload-value'))
    };

    const result = editionSchema.safeParse(datasetEdition)
    response.success = result.success

    if (!response.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = datasetEdition;
    } else {
        const reqCfg = await SSRequestConfig(cookies);
        try {
            const data = await httpPost(reqCfg, "/datasets", datasetEdition);
            if (data.status == 403) {
                response.success = false;
                response.recentlySumbitted = false;
                response.code = data.status;
            } else {
                response.recentlySumbitted = true;
            }
        } catch (err) {
            return err.toString();
        }
    }
    return response;
}
