"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createDataset, updateDataset } from "@/utils/request/api-clients/datasets";
import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { logInfo } from "@/utils/log/log";

import { z } from "zod";

const createSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    id: z.string().min(1, { message: "ID is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    topics: z.string().array().nonempty({ message: "Topic is required" }),
    next_release: z.string().min(1, { message: "Next release is required" }),
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
        id: formData.get("dataset-series-id"),
        // we store original topic field so this can be returned to create/edit form
        // in it's raw/original format
        originalTopics: JSON.parse(formData.get("dataset-series-topics-input")),
        description: formData.get("dataset-series-description"),
        contacts: JSON.parse(formData.get("dataset-series-contacts")),
        next_release: formData.get("dataset-series-next-release"),
        qmi: { 
            href: formData.get("dataset-series-qmi") 
        },
        keywords: [ formData.get("dataset-series-keywords") ],
    };

    datasetSeriesSubmission.topics = datasetSeriesSubmission.originalTopics.map(topic => topic.id ? topic.id : topic);
    return datasetSeriesSubmission;
};

const createResponse = async (datasetSeriesSubmission, result, doRequest)  =>  {
    const response = {};
    response.success = result.success;
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = datasetSeriesSubmission;
        logInfo("failed dataset series validation", null, null);
    } else {
        const accessToken = await getAcessTokenFromCookie(cookies);
        try {
            const data = await doRequest(accessToken);
            if (data.status >= 400) {
                response.success = false;
                response.recentlySubmitted = false;
                response.code = data.status;
                const errorMessage = data.error?.errorMessage?.trim() || "";
                
                if (errorMessage === "dataset already exists") {
                    response.httpError = `A dataset series with an ID of ${datasetSeriesSubmission.id} already exists`;
                } else if (errorMessage === "dataset title already exists") {
                    response.httpError = `A dataset series titled ${datasetSeriesSubmission.title} already exists`;
                } else {
                    response.httpError = errorMessage;
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
    const datasetSeriesSubmission = getFormData(formData);
    const validation = createSchema.safeParse(datasetSeriesSubmission);

    return createResponse(
        datasetSeriesSubmission,
        validation,
        (token) => createDataset(datasetSeriesSubmission, token)
    );
}

export async function updateDatasetSeries(originalId, currentstate, formData) {
    const datasetSeriesSubmission = getFormData(formData);
    const validation = editSchema.safeParse(datasetSeriesSubmission);
    // editing a series without explicity setting the state to 
    // "associated" will mean the state returns to "created" 
    datasetSeriesSubmission.state = "associated";

    return createResponse(
        datasetSeriesSubmission,
        validation,
        (token) => updateDataset(originalId, datasetSeriesSubmission, token)
    );
}
