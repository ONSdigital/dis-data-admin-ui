'use server'

import { cookies } from "next/headers";

import { httpPost, httpPut, SSRequestConfig } from "@/utils/request/request";

import { z } from "zod";

const createSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    id: z.string().min(1, { message: "ID is required" }),
    topics: z.string().array().nonempty({ message: "Topic is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    contacts: z.array(z.object({
        name: z.string(),
        email: z.string()
    })).min(1, { message: "Contact is required" })
})

const editSchema = createSchema.omit({ id: true });

const getFormData = (formData) => {
    // keywords and next_release is placeholder untill a ticket is made, possibly with design, to implement these fields properly.
    const datasetSeriesSubmission = {
        type: formData.get('dataset-series-type'),
        title: formData.get('dataset-series-title'),
        id : formData.get('dataset-series-id'),
        topics: JSON.parse(formData.get('dataset-series-topics')),
        description: formData.get('dataset-series-description'),
        contacts: JSON.parse(formData.get('dataset-series-contacts')),
        keywords: [""],
        next_release: "To be announced"
    }

    return datasetSeriesSubmission
};

const createResponse = async (datasetSeriesSubmission, result, url, type)  =>  {
    const response = {}
    response.success = result.success
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors
        response.submission = datasetSeriesSubmission
    } else {
        const reqCfg = await SSRequestConfig(cookies);
        try {
            let data
            if (type == "put"){
                data = await httpPut(reqCfg, url, datasetSeriesSubmission)
            } else {
                data = await httpPost(reqCfg, url, datasetSeriesSubmission);
                console.log(data)
            }
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
};

export async function createDatasetSeries(currentstate, formData) {
    const url = "/datasets"

    const datasetSeriesSubmission = getFormData(formData)
    const result = createSchema.safeParse(datasetSeriesSubmission)

    return createResponse(datasetSeriesSubmission, result, url)
}

export async function updateDatasetSeries(currentstate, formData) {
    const datasetSeriesSubmissionID = formData.get('dataset-series-id')
    const url = "/datasets/" + datasetSeriesSubmissionID

    const datasetSeriesSubmission = getFormData(formData)
    const result = editSchema.safeParse(datasetSeriesSubmission)

    return createResponse(datasetSeriesSubmission, result, url, "put")
}
