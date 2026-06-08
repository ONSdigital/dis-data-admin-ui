"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { httpPost, httpPut, SSRequestConfig } from "@/utils/request/request";
import { logInfo } from "@/utils/log/log";

import { z } from "zod";

const createSchema = z.object({
    source_id: z.string().min(1, { message: "Source URI is required" }),
    target_id: z.string().min(1, { message: "ID is required" }),
});

const stateSchema = z.object({
    state: z.enum(["approved", "rejected"])
});

const getFormData = (formData) => {
    const migrationJobSubmission = {
        source_id: formData.get("source-uri"),
        target_id: formData.get("dataset-series-id"),
        type: formData.get("dataset-series-type")
    };

    return migrationJobSubmission;
};

const createResponse = async (migrationJobSubmission, result, url, makeRequest, series = null) => {
    const response = {};
    response.success = result.success;
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = migrationJobSubmission;
        logInfo("failed create/update migration validation", null, null);
    } else {
        const reqCfg = await SSRequestConfig(cookies, "migration-service");
        try {
            const data = await makeRequest(reqCfg, url, migrationJobSubmission);
            if (data.status >= 400) {
                response.success = false;
                response.recentlySubmitted = false;
                response.code = data.status;

                const parsedError = JSON.parse(data.errorMessage);
                const rawError = parsedError.errors[0].description.trim();
                // Capitalise first letter of returned error description
                response.httpError = rawError.charAt(0).toUpperCase() + rawError.slice(1);
            } else {
                response.recentlySubmitted = true;
                response.jobNumber = data.job_number;
                logInfo("migration job created/updated successfully");
            }
        } catch (err) {
            return err.toString();
        }
        if (response.success == true && response.jobNumber) {
            redirect(`/migration/${response.jobNumber}`);
        } else if (response.success == true && migrationJobSubmission.state == "approved") {
            redirect(`/migration?display_approve_success=true&series=${series}`);
        } else if (response.success == true && migrationJobSubmission.state == "rejected") {
            redirect(`/migration?display_rejected_success=true&series=${series}`);
        }
    }
    return response;
};

export async function createMigrationJob(currentstate, formData) {
    const url = "/migration-jobs";

    const migrationJobSubmission = getFormData(formData);
    const validation = createSchema.safeParse(migrationJobSubmission);

    return createResponse(migrationJobSubmission, validation, url, httpPost);
}

export async function updateMigrationJobState(jobID, newState, series) {
    const url = "/migration-jobs/" + jobID + "/state";

    const stateUpdate = {
        state: newState
    };

    const validation = stateSchema.safeParse(stateUpdate);

    return createResponse(stateUpdate, validation, url, httpPut, series);
}
