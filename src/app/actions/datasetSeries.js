"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createDataset, updateDataset } from "@/utils/request/api-clients/datasets";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { logInfo } from "@/utils/log/log";

import { z } from "zod";

const datasetSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    id: z.string()
        .min(1, { message: "ID is required" })
        .regex(/^[a-zA-Z0-9-]*$/, { message: "ID can only contain letters, numbers and dashes" }),
    description: z.string().min(1, { message: "Description is required" }),
    topics: z.string().array().nonempty({ message: "Topic is required" }),
    next_release: z.string().min(1, { message: "Next release is required" }),
    contacts: z.array(z.object({
        name: z.string().min(1, { message: "Contact name is required" }),
        email: z.email(),
        telephone: z.string().optional(),
    })).min(1, { message: "Contact is required" }),
});

const parseMultiContentField = (multiItem) => {
    if (!multiItem || !multiItem.length) return [];

    return multiItem.map((item, index) => ({ index, content: JSON.parse(item) }))
        .filter(({ content }) => Object.values(content).some(Boolean));
};

const getFormData = (formData) => {
    const parsedContacts = parseMultiContentField(formData.getAll("dataset-series-contacts"));
    const datasetSeriesSubmission = {
        type: formData.get("dataset-series-type"),
        license: formData.get("dataset-series-license"),
        title: formData.get("dataset-series-title"),
        id: formData.get("dataset-series-id")?.trim(),
        // we store original topic field so this can be returned to create/edit form
        // in it's raw/original format
        originalTopics: JSON.parse(formData.get("dataset-series-topics-input")),
        description: formData.get("dataset-series-description"),
        contacts: parsedContacts.map(item => item.content),
        next_release: formData.get("dataset-series-next-release"),
        qmi: { 
            href: formData.get("dataset-series-qmi") 
        },
        keywords: [],
    };

    const keywords = (formData.get("dataset-series-keywords") || "").trim();
    if (keywords) {
        datasetSeriesSubmission.keywords = keywords.split(",").map(keyword => keyword.trim()).filter(Boolean);
    }

    datasetSeriesSubmission.topics = datasetSeriesSubmission.originalTopics.map(topic => topic.id ? topic.id : topic);
    return {
        submission: datasetSeriesSubmission,
        contactIndexes: parsedContacts.map(item => item.index),
    };
};

// maps Zod issues such as { path: ["contacts", 1, "email"] } to input IDs,
// e.g. { "dataset-series-contacts-email-2": ["Invalid email address"] }
// array-level issues such as { path: ["contacts"] } stay on "contacts"
const getContactErrors = (issues, contactIndexes = []) => {
    const errors = {};
    issues.forEach(issue => {
        const [field, itemIndex, key] = issue.path;
        if (field !== "contacts") return;
        if (key == null) {
            errors.contacts = [...(errors.contacts || []), issue.message];
            return;
        }
        errors[`dataset-series-contacts-${key}-${contactIndexes[itemIndex]}`] = [issue.message];
    });
    return errors;
};

const createResponse = async (datasetSeriesSubmission, result, doRequest)  =>  {
    const response = {};
    response.success = result.success;
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = datasetSeriesSubmission;
        logInfo("failed dataset series validation", null, null);
    } else {
        const accessToken = await getAccessTokenFromCookie(cookies);
        try {
            const data = await doRequest(accessToken);
            if (data.error) {
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

const handleFailedValidation = (validation, datasetSeriesSubmission, contactIndexes) => {
    const { contacts: _contacts, ...fieldErrors } = validation.error.flatten().fieldErrors;
    const actionResponse = {};
    actionResponse.success = validation.success;
    actionResponse.errors = {
        ...fieldErrors,
        ...getContactErrors(validation.error.issues, contactIndexes),
    };
    actionResponse.submission = datasetSeriesSubmission;
    logInfo("failed dataset series validation", null, null);
    return actionResponse;
};

export async function createDatasetSeries(currentstate, formData) {
    const { submission: datasetSeriesSubmission, contactIndexes } = getFormData(formData);
    const validation = datasetSchema.safeParse(datasetSeriesSubmission);
    
    if (!validation.success) {
        return handleFailedValidation(validation, datasetSeriesSubmission, contactIndexes);
    }

    return createResponse(
        datasetSeriesSubmission,
        validation,
        (token) => createDataset(datasetSeriesSubmission, token)
    );
}

export async function updateDatasetSeries(originalId, currentstate, formData) {
    const { submission: datasetSeriesSubmission, contactIndexes } = getFormData(formData);
    const validation = datasetSchema.safeParse(datasetSeriesSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetSeriesSubmission, contactIndexes);
    }
    
    // editing a series without explicity setting the state to 
    // "associated" will mean the state returns to "created" 
    datasetSeriesSubmission.state = "associated";

    return createResponse(
        datasetSeriesSubmission,
        validation,
        (token) => updateDataset(originalId, datasetSeriesSubmission, token)
    );
}
