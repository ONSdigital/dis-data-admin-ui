"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import getAppConfig from "@/utils/config/config";
import { httpPut } from "@/utils/request/request";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { createVersion, updateVersion } from "@/utils/request/api-clients/datasets";

import { logError, logInfo } from "@/utils/log/log";
import { getDistributionPath } from "@/utils/url/url";

import { z } from "zod";

const usageNotesSchema = z.array(z.object({
    title: z.string().min(1, { message: "Usage note title is required" }),
    note: z.string().min(1, { message: "Usage note is required" }),
})).optional();

const alertsSchema = z.array(z.object({
    type: z.string().min(1, { message: "Alert type is required" }),
    description: z.string().min(1, { message: "Alert note is required" }),
})).optional();

// check and parse "MultiContent" (e.g. alerts and usage notes) fields,
// keeping the index each item was rendered at so errors can be mapped back to the right inputs
const parseMultiContentField = (multiItem) => {
    if (!multiItem || !multiItem.length) return [];

    return multiItem.map((item, index) => ({ index, content: JSON.parse(item) }))
        .filter(({ content }) => Object.values(content).some(Boolean));
};

// maps Zod issues such as { path: ["usage_notes", 1, "note"] } to input IDs,
// e.g. { "usage-notes-textarea-2": ["Usage note is required"] }
// and { path: ["alerts", 0, "type"] } to { "alerts-radios-0": ["Alert type is required"] }
const getMultiContentErrors = (issues, usageNoteIndexes = [], alertIndexes = []) => {
    const errors = {};
    issues.forEach(issue => {
        const [field, itemIndex, key] = issue.path;
        if (field === "usage_notes") {
            const inputName = key === "note" ? "textarea" : "input";
            errors[`usage-notes-${inputName}-${usageNoteIndexes[itemIndex]}`] = [issue.message];
        }
        if (field === "alerts") {
            const inputName = key === "description" ? "textarea" : "radios";
            errors[`alerts-${inputName}-${alertIndexes[itemIndex]}`] = [issue.message];
        }
    });
    return errors;
};

const versionSchema = z.object({
    quality_designation: z.string().min(1, { message: "Quality designation is required" }),
    release_day: z.string().min(1, { message: "Day is required" }),
    release_month: z.string().min(1, { message: "Month is required" }),
    release_year: z.string().min(1, { message: "Year is required" }),
    release_hour: z.string().min(1, { message: "Hour is required" }),
    release_minutes: z.string().min(1, { message: "Minutes are required" }),
    release_date: z.string().min(1, { message: "A release time and date is required" }),
    usage_notes: usageNotesSchema,
    alerts: alertsSchema,
    distributions: z.array(z.object({
        download_url: z.string().min(1, { message: "A file upload is required" }),
    })).min(1, { message: "A file upload is required" })
});

// check for an error on distrubution and update error message
// zod replies with "Required" for objects
const addUploadFileErrorMessage = async (errors) => {
    if (!errors) {
        return;
    } 
    if (errors.distributions) {
        errors.distributions = ["File upload is required"];
    }
    return errors;
};

// check and parse related content fields 
const parseRelatedContent = (relatedContent) => {
    if (!relatedContent || !relatedContent.length) return [];
    try {
        return JSON.parse(relatedContent);
    /* eslint-disable-next-line no-unused-vars */
    } catch (err) {
        return [];
    }
};

/**
 * Updates file metadata for each distribution in a dataset version.
 *
 * @param {string} accessToken - Access token used for authenticated API requests.
 * @param {Array<{download_url: string}>} distributions - Array of distribution objects containing download URLs.
 * @param {string} datasetID - The dataset ID.
 * @param {string} editionID - The edition ID.
 * @param {number} versionID - The version number.
 * @returns {Promise<{success: boolean, failures: Array<{download_url: string, status: number|null, error: string|null}>}>}
 *   Resolves with a summary of any failed updates.
 */
const updateDistributionsMetadata = async (accessToken, distributions = [], datasetID, editionID, versionID) => {
    const fileMetadataUpdateRequests = distributions.map(async (distribution) => {
        const filePath = getDistributionPath(distribution?.download_url);

        if (!filePath) {
            logError("invalid file path", distribution, null, null);
            return { success: false, distribution, status: null, error: "invalid file path" };
        }

        try {
            const apiRouterURL = getAppConfig().apiRouterURL;
            const response = await httpPut(`${apiRouterURL}/files/${filePath}`, accessToken, {
                content_item: {
                    dataset_id: datasetID,
                    edition: editionID,
                    version: String(versionID),
                },
            });

            if (response.error) {
                logError("failed to update file metadata", distribution, response.status, null);
                return { success: false, distribution, status: response.status, error: response.error?.errorMessage };
            }

            return { success: true, distribution };

        } catch (err) {
            logError("error updating file metadata", distribution, null, err);
            return { success: false, distribution, status: null, error: err.toString() };
        }
    });

    const fileMetadataUpdateResponses = await Promise.all(fileMetadataUpdateRequests);
    const failures = fileMetadataUpdateResponses.filter(r => !r.success);

    return { success: failures.length === 0, failures };
};

const doSubmission = async (datasetVersionSubmission, doRequest) => {
    const accessToken = await getAccessTokenFromCookie(cookies);

    let versionResponse;
    try {
        versionResponse = await doRequest(accessToken);
        if (versionResponse.error) {
            return { success: false, code: versionResponse.status };
        }
        logInfo("created dataset version successfully", null, null);
    } catch (err) {
        logError("error saving dataset version", null, null, err);
        return { success: false, code: 500 };
    }

    const versionID = versionResponse.response?.version || datasetVersionSubmission.version_id;
    try {
        const distributionUpdateResponse = await updateDistributionsMetadata(
            accessToken,
            datasetVersionSubmission.distributions,
            datasetVersionSubmission.dataset_id,
            datasetVersionSubmission.edition,
            versionID
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

    redirect("/series/" + datasetVersionSubmission.dataset_id + "/editions/" + datasetVersionSubmission.edition + "/versions/" + versionID + "?display_success=true");
};

const getFormData = async (formData) => {
    const usageNotes = parseMultiContentField(formData.getAll("usage-notes"));
    const alerts = parseMultiContentField(formData.getAll("alerts"));
    const relatedContent = formData.getAll("related-content-version");
    const parsedRelatedContent = parseRelatedContent(relatedContent);
    const datasetVersion = {
        dataset_id: formData.get("dataset-id"),
        edition: formData.get("edition-id")?.trim(),
        version_id: formData.get("version-id"),
        edition_title: formData.get("edition-title"),
        quality_designation: formData.get("quality-designation-value"),
        release_day: formData.get("release-date-day"),
        release_month: formData.get("release-date-month"),
        release_year: formData.get("release-date-year"),
        release_hour: formData.get("release-date-hour"),
        release_minutes: formData.get("release-date-minutes"),
        release_date: formData.get("release-date-value"),
        usage_notes: usageNotes.map(item => item.content),
        alerts: alerts.map(item => item.content),
        distributions: JSON.parse(formData.get("dataset-upload-value")),
        related_content: parsedRelatedContent,
        type: "static",
    };
    return {
        submission: datasetVersion,
        usageNoteIndexes: usageNotes.map(item => item.index),
        alertIndexes: alerts.map(item => item.index),
    };
};

const handleFailedValidation = async (validation, datasetVersionSubmission, usageNoteIndexes, alertIndexes) => {
    const { usage_notes: _usageNotes, alerts: _alerts, ...fieldErrors } = validation.error.flatten().fieldErrors;
    const actionResponse = {};
    actionResponse.success = validation.success;
    actionResponse.errors = {
        ...await addUploadFileErrorMessage(fieldErrors),
        ...getMultiContentErrors(validation.error.issues, usageNoteIndexes, alertIndexes),
    };
    actionResponse.submission = datasetVersionSubmission;
    logInfo("failed dataset version validation", null, null);
    return actionResponse;
};

const createDatasetVersion = async (currentstate, formData) => {
    const { submission: datasetVersionSubmission, usageNoteIndexes, alertIndexes } = await getFormData(formData);
    const validation = versionSchema.safeParse(datasetVersionSubmission);

    if (!validation.success) {
        return await handleFailedValidation(validation, datasetVersionSubmission, usageNoteIndexes, alertIndexes);
    }
    const { dataset_id: datasetID, edition: editionID } = datasetVersionSubmission;
    return doSubmission(
        datasetVersionSubmission,
        (token) => createVersion(datasetID, editionID, datasetVersionSubmission, token)
    );
};

const updateDatasetVersion = async (currentstate, formData) => {
    const { submission: datasetVersionSubmission, usageNoteIndexes, alertIndexes } = await getFormData(formData);
    const validation = versionSchema.safeParse(datasetVersionSubmission);

    if (!validation.success) {
        return await handleFailedValidation(validation, datasetVersionSubmission, usageNoteIndexes, alertIndexes);
    }
    const { dataset_id: datasetID, edition: editionID, version_id: versionID } = datasetVersionSubmission;
    return doSubmission(
        datasetVersionSubmission,
        (token) => updateVersion(datasetID, editionID, versionID, datasetVersionSubmission, token)
    );
};

export { createDatasetVersion, updateDatasetVersion, getFormData, handleFailedValidation, updateDistributionsMetadata, addUploadFileErrorMessage };
