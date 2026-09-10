"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createMigration, updateMigration } from "@/utils/request/api-clients/migration";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";
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

const createResponse = async (migrationJobSubmission, result, doRequest, series = null) => {
    const response = {};
    response.success = result.success;
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = migrationJobSubmission;
        logInfo("failed create/update migration validation", null, null);
    } else {
        const accessToken = await getAccessTokenFromCookie(cookies);
        try {
            const data = await doRequest(accessToken);
            if (data.status >= 400) {
                response.success = false;
                response.recentlySubmitted = false;
                response.code = data.status;

                const rawError = (data.error?.errorMessage || "").trim();
                // Capitalise first letter of returned error description
                response.httpError = rawError.charAt(0).toUpperCase() + rawError.slice(1);
            } else {
                response.recentlySubmitted = true;
                response.jobNumber = data.response?.job_number;
                logInfo("migration job created/updated successfully");
            }
        } catch (err) {
            return err.toString();
        }
        if (response.success == true && response.jobNumber) {
            redirect(`/migration/${response.jobNumber}?display_job_create_success=true&jobNumber=${response.jobNumber}`);
        } else if (response.success == true && migrationJobSubmission.state == "approved") {
            redirect(`/migration?display_approve_success=true&series=${series}`);
        } else if (response.success == true && migrationJobSubmission.state == "rejected") {
            redirect(`/migration?display_rejected_success=true&series=${series}`);
        }
    }
    return response;
};

export async function createMigrationJob(currentstate, formData) {
    const migrationJobSubmission = getFormData(formData);
    const validation = createSchema.safeParse(migrationJobSubmission);

    return createResponse(
        migrationJobSubmission,
        validation,
        (token) => createMigration(migrationJobSubmission, token)
    );
}

export async function updateMigrationJobState(jobID, newState, series) {
    const stateUpdate = {
        state: newState
    };

    const validation = stateSchema.safeParse(stateUpdate);

    return createResponse(
        stateUpdate,
        validation,
        (token) => updateMigration(jobID, stateUpdate, token),
        series
    );
}
