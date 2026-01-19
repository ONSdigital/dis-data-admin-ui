"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SSRequestConfig, httpPut } from "@/utils/request/request";
import { logInfo, logError } from "@/utils/log/log";

/**
 * Publishes a dataset by updating its state to "published"
 * @param {FormData} formData - Form data containing the dataset ID
 * @returns {Promise<Object>} Response object with success status and error details
 */
export const publishAction = async (currentState, formData) => {
    const actionResponse = {
        success: false,
        code: null,
        errors: {}
    };

    const reqCfg = await SSRequestConfig(cookies);

    const datasetInput = formData.get("dataset");
    const dataset = JSON.parse(datasetInput);
    if (!dataset?.id) {
        actionResponse.success = false;
        actionResponse.errors = { api: ["Dataset ID is required"] };
        return actionResponse;
    }

    const url = `/datasets/${dataset.id}`;
    dataset.state = "published";

    try {
        const request = await httpPut(reqCfg, url, dataset);
        if (request.status >= 400) {
            actionResponse.success = false;
            actionResponse.code = request.status;
            return actionResponse;
        }
        actionResponse.success = true;
        logInfo(`successfully published ${dataset.id}`, null, null);
    } catch (err) {
        logError("failed to make publish request", null, null, err);
        actionResponse.success = false;
        actionResponse.errors = { api: [err?.message || err.toString()] };
    }

    if (actionResponse.success) {
        redirect(`/series/${dataset.id}?display_publish_success=true`);
    }

    return actionResponse;
};