"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { deleteDataset, deleteVersion } from "@/utils/request/api-clients/datasets";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { logInfo, logError } from "@/utils/log/log";

export const deleteDatasetOrVersion = async (currentState, formData) => {
    const actionResponse = {};
    const confirmed = formData.get("confirm-delete");
    const datasetID = formData.get("dataset-id");
    const editionID = formData.get("edition-id");
    const versionID = formData.get("version-id");
    const titleOfContentToDelete = formData.get("title-of-content-to-delete");

    if (!confirmed) {
        actionResponse.success = false;
        actionResponse.errors = { "confirm-delete": ["You must confirm deletion."] };
        return actionResponse;
    }

    const accessToken = await getAccessTokenFromCookie(cookies);

    try {
        const response = (editionID && versionID)
            ? await deleteVersion(datasetID, editionID, versionID, accessToken)
            : await deleteDataset(datasetID, accessToken);
        // dp-dataset-api returns 200 when deleting a version and 204 when deleting a dataset
        if (![200, 204].includes(response.status)) {
            return {
                success: false,
                code: response.status,
                errors: { api: ["Failed to delete."] }
            };
        }
        actionResponse.success = true;
        logInfo(`successfully deleted ${titleOfContentToDelete}`, null, null);
    } catch (err) {
        logError("failed to make delete request", null, null, err);
        actionResponse.success = false;
        actionResponse.errors = { api: [err.toString()] };
    }

    if (actionResponse.success) {
        redirect(`/series/?display_delete_success=true`);
    }

    return actionResponse;
};