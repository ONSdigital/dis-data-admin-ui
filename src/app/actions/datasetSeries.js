"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { httpPost, httpPut, SSRequestConfig } from "@/utils/request/request";
import { logInfo } from "@/utils/log/log";

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
});

const editSchema = createSchema.omit({ id: true });

const getFormData = (formData) => {
    // keywords and next_release is placeholder until a ticket is made, possibly with design, to implement these fields properly.
    const datasetSeriesSubmission = {
        type: formData.get("dataset-series-type"),
        license: formData.get("dataset-series-license"),
        title: formData.get("dataset-series-title"),
        id : formData.get("dataset-series-id"),
        topics: JSON.parse(formData.get("dataset-series-topics-input")),
        description: formData.get("dataset-series-description"),
        contacts: JSON.parse(formData.get("dataset-series-contacts")),
        qmi: { 
            href: formData.get("dataset-series-qmi") 
        },
        keywords: [ formData.get("dataset-series-keywords") ],
        next_release: "To be announced"
    };

    return datasetSeriesSubmission;
};

const createResponse = async (datasetSeriesSubmission, result, url, makeRequest)  =>  {
    const response = {};
    response.success = result.success;
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = datasetSeriesSubmission;
        logInfo("failed dataset series validation", null, null);
    } else {
        const reqCfg = await SSRequestConfig(cookies);
        try {
            const data = await makeRequest(reqCfg, url, datasetSeriesSubmission);
            if (data.status >= 400) {
                response.success = false;
                response.recentlySubmitted = false;
                response.code = data.status;
                
                if (data.errorMessage.trim() === "dataset already exists") {
                    response.httpError = `A dataset series with an ID of ${datasetSeriesSubmission.id} already exists`;
                } else if (data.errorMessage.trim() === "dataset title already exists") {
                    response.httpError = `A dataset series titled ${datasetSeriesSubmission.title} already exists`;
                } else {
                    response.httpError = data.errorMessage;
                }
            } else {
                response.recentlySubmitted = true;
                logInfo("dataset series created/updated successfully", {dataset_id: datasetSeriesSubmission.id}, null);
            }
        } catch (err) {
            return err.toString();
        }
        if (response.success == true) {
            redirect("/series/" + datasetSeriesSubmission.id + "?display_success=true");
        }
    }
    return response;
};

export async function createDatasetSeries(currentstate, formData) {
    const url = "/datasets";

    const datasetSeriesSubmission = getFormData(formData);
    const validation = createSchema.safeParse(datasetSeriesSubmission);

    return createResponse(datasetSeriesSubmission, validation, url, httpPost);
}

export async function updateDatasetSeries(currentstate, formData) {
    const datasetSeriesSubmissionID = formData.get("dataset-series-id");
    const url = "/datasets/" + datasetSeriesSubmissionID;

    const datasetSeriesSubmission = getFormData(formData);
    const validation = editSchema.safeParse(datasetSeriesSubmission);

    return createResponse(datasetSeriesSubmission, validation, url, httpPut);
}
