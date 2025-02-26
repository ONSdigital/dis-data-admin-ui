'use server'

import { cookies } from "next/headers";

import { httpPost, SSRequestConfig } from "@/utils/request/request";

import { z } from "zod";
 
const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    id: z.string().min(1, { message: "ID is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    contacts: z.array(z.object({
        name: z.string(),
        email: z.string()
    })).min(1, { message: "A contact is required" })
})

export async function createDatasetSeries(currentstate, formData) {
    let response = {}

    const datasetSeriesSubmission = {
        title: formData.get('datasetSeriesTitle'),
        id: formData.get('datasetSeriesID'),
        description: formData.get('datasetSeriesDescription'),
        contacts: JSON.parse(formData.get('datasetSeriesContacts'))
    }

    const result = schema.safeParse(datasetSeriesSubmission)
    response.success = result.success

    if (!response.success) {
        response.errors = result.error.flatten().fieldErrors
        response.submission = datasetSeriesSubmission
    } else {
        const reqCfg = await SSRequestConfig(cookies);
        try {
            const data = await httpPost(reqCfg, "/datasets", datasetSeriesSubmission);
            if (data.status == 403) {
                response.success = false
                response.recentlySumbitted = false
                response.code = data.status
            } else {
                response.recentlySumbitted = true
            }
        } catch (err) {
            return err.toString();
        }
    }
    return response
}
