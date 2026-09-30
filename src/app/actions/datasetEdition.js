"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createVersion, updateVersion } from "@/utils/request/api-clients/datasets";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { logError, logInfo } from "@/utils/log/log";
import { handleFailedValidation as handleWithVersionFailedValidation, updateDistributionsMetadata, parseMultiContentField } from "./datasetVersion";

import { z } from "zod";
 
const editionSchema = z.object({
    edition: z.string()
        .min(1, { message: "Edition ID is required" })
        .regex(/^[a-zA-Z0-9-]*$/, { message: "Edition ID can only contain letters, numbers and dashes" }),
    edition_title: z.string().min(1, { message: "Edition title is required" }),
    related_content: z.array(z.object({
        title: z.string().min(1, { message: "Related content title is required" }),
        href: z.string().min(1, { message: "Related content URL is required" }),
        description: z.string().optional(),
    })).optional(),
});

const editionWithVersionSchema = z.object({
    edition: z.string()
        .min(1, { message: "Edition ID is required" })
        .regex(/^[a-zA-Z0-9-]*$/, { message: "Edition ID can only contain letters, numbers and dashes" }),
    edition_title: z.string().min(1, { message: "Edition title is required" }),
    quality_designation: z.string().min(1, { message: "Quality designation is required" }),
    release_day: z.string().min(1, { message: "Day is required" }),
    release_month: z.string().min(1, { message: "Month is required" }),
    release_year: z.string().min(1, { message: "Year is required" }),
    release_hour: z.string().min(1, { message: "Hour is required" }),
    release_minutes: z.string().min(1, { message: "Minutes are required" }),
    release_date: z.string().min(1, { message: "A release time and date is required" }),
    distributions: z.array(z.object({
        download_url: z.string(),
    })).min(1, { message: "A file upload is required" })
});

const doSubmission = async (datasetEditionSubmission, doRequest) => {
    const accessToken = await getAccessTokenFromCookie(cookies);
    const datasetID = datasetEditionSubmission.dataset_id;

    let editionResponse = {};
    try {
        editionResponse = await doRequest(accessToken);
        if (editionResponse.error) {
            let httpError;
            if (editionResponse.error?.code === "ErrVersionAlreadyExists") {
                httpError = "A edition with this ID already exists within this series";
            } else if (editionResponse.error?.code === "ErrEditionTitleAlreadyExists") {
                httpError = "A edition with this Title already exists within this series";
            }
            return { success: false, code: editionResponse.status, httpError };
        }
        logInfo("saved dataset edition successfully", null, null);
    } catch (err) {
        logError("error saving dataset edition", null, null, err);
        return { success: false, code: 500 };
    }

    try {
        const distributionUpdateResponse = await updateDistributionsMetadata(
            accessToken,
            editionResponse.response?.distributions,
            datasetEditionSubmission.dataset_id,
            datasetEditionSubmission.edition,
            1
        );
        if (!distributionUpdateResponse.success) {
            logError("one or more file metadata updates failed", distributionUpdateResponse.failures, null);
            return {
                success: false,
                code: 500,
                httpError: "Failed to update file metadata. Please raise a support issue through Slack.",
            };
        }
        logInfo("successfully updated file metadata for distributions");
    } catch (err) {
        logError("error updating file metadata", null, null, err);
        return {
            success: false,
            code: 500,
            httpError: "Failed to update file metadata. Please raise a support issue through Slack.",
        };
    }

    redirect(`/series/${datasetID}/editions/${datasetEditionSubmission.edition}?display_success=true`);
};

// check and parse "MultiContent" (e.g. related content) fields, keeping the index
// each item was rendered at so errors can be mapped back to the right inputs
const parseRelatedContent = (multiItem) => {
    if (!multiItem || !multiItem.length) return [];

    return multiItem.map((item, index) => ({ index, content: JSON.parse(item) }))
        .filter(({ content }) => content.title || content.href || content.description);
};

const getUpdateEditionFormData = (formData) => {
    const relatedContent = parseRelatedContent(formData.getAll("related-content"));
    return {
        submission: {
            dataset_id: formData.get("dataset-id"),
            edition_id: formData.get("current-edition-id"),
            edition: formData.get("edition-id")?.trim(),
            edition_title: formData.get("edition-title"),
            type: "static",
            related_content: relatedContent.map(item => item.content),
        },
        relatedContentIndexes: relatedContent.map(item => item.index),
    };
};

const getCreateEditionFormData = async (formData) => {
    const usageNotes = formData.getAll("usage-notes");
    const parsedUsageNotes = await parseMultiContentField(usageNotes);
    const alerts = formData.getAll("alerts");
    const parsedAlerts = await parseMultiContentField(alerts);
    const relatedContent = parseRelatedContent(formData.getAll("related-content"));
    return {
        submission: {
            dataset_id: formData.get("dataset-id"),
            edition_id: formData.get("current-edition-id"),
            edition: formData.get("edition-id")?.trim(),
            edition_title: formData.get("edition-title"),
            related_content: relatedContent.map(item => item.content),
            quality_designation: formData.get("quality-designation-value"),
            release_day: formData.get("release-date-day"),
            release_month: formData.get("release-date-month"),
            release_year: formData.get("release-date-year"),
            release_hour: formData.get("release-date-hour"),
            release_minutes: formData.get("release-date-minutes"),
            release_date: formData.get("release-date-value"),
            usage_notes: parsedUsageNotes,
            alerts: parsedAlerts,
            distributions: JSON.parse(formData.get("dataset-upload-value")),
            type: "static",
        },
        relatedContentIndexes: relatedContent.map(item => item.index),
    };
};

// maps Zod issues such as { path: ["related_content", 1, "href"] } to input IDs,
// e.g. { "related-content-url-2": ["Related content URL is required"] }
const getRelatedContentErrors = (issues, relatedContentIndexes) => {
    const errors = {};
    issues.forEach(issue => {
        const [field, itemIndex, key] = issue.path;
        if (field !== "related_content") return;
        const inputName = key === "href" ? "url" : key;
        errors[`related-content-${inputName}-${relatedContentIndexes[itemIndex]}`] = [issue.message];
    });
    return errors;
};

const handleFailedValidation = (validation, datasetEditionSubmission, relatedContentIndexes) => {
    const { related_content: _relatedContent, ...fieldErrors } = validation.error.flatten().fieldErrors;
    const actionResponse = {};
    actionResponse.success = validation.success;
    actionResponse.errors = {
        ...fieldErrors,
        ...getRelatedContentErrors(validation.error.issues, relatedContentIndexes),
    };
    actionResponse.submission = datasetEditionSubmission;
    logInfo("failed dataset edition validation", null, null);
    return actionResponse;
};

const createDatasetEdition = async (currentstate, formData) => {
    console.log("here 1")
    const { submission: datasetEditionSubmission, relatedContentIndexes } = await getCreateEditionFormData(formData);
    const validation = editionWithVersionSchema.safeParse(datasetEditionSubmission);

    console.log("here 2")
    console.log("datasetEditionSubmission", datasetEditionSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetEditionSubmission, relatedContentIndexes);
    }

    console.log("here 3")
    const datasetID = datasetEditionSubmission.dataset_id;
    const editionID = datasetEditionSubmission.edition;
    console.log("datasetEditionSubmission", datasetEditionSubmission);

    return doSubmission(
        datasetEditionSubmission,
        (token) => createVersion(datasetID, editionID, datasetEditionSubmission, token)
    );
};

const updateDatasetEdition = async (currentstate, formData) => {
    const { submission: datasetEditionSubmission, relatedContentIndexes } = await getUpdateEditionFormData(formData);
    const validation = editionSchema.safeParse(datasetEditionSubmission);

    if (!validation.success) {
        return handleFailedValidation(validation, datasetEditionSubmission, relatedContentIndexes);
    }
    const datasetID = datasetEditionSubmission.dataset_id;
    const editionID = datasetEditionSubmission.edition_id || datasetEditionSubmission.edition;
    console.log("datasetEditionSubmission", datasetEditionSubmission);
    return doSubmission(
        datasetEditionSubmission,
        (token) => updateVersion(datasetID, editionID, 1, datasetEditionSubmission, token)
    );
};

export { createDatasetEdition, updateDatasetEdition };
