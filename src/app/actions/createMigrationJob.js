"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { httpPost, SSRequestConfig } from "@/utils/request/request";
import { logInfo } from "@/utils/log/log";

import { z } from "zod";

const createSchema = z.object({
    source_id: z.string().min(1, { message: "Source URI is required" }),
    target_id: z.string().min(1, { message: "ID is required" }),
});

const getFormData = (formData) => {
    const migrationJobSubmission = {
        source_id: formData.get("source-uri"),
        target_id: formData.get("dataset-series-id"),
        type: formData.get("dataset-series-type")
    };

    return migrationJobSubmission;
};

const createResponse = async (migrationJobSubmission, result, url, makeRequest) => {
    const response = {};
    response.success = result.success;
    if (!result.success) {
        response.errors = result.error.flatten().fieldErrors;
        response.submission = migrationJobSubmission;
        logInfo("failed create migration validation", null, null);
    } else {
        const reqCfg = await SSRequestConfig(cookies, "migration-service");
        try {
            const data = await makeRequest(reqCfg, url, migrationJobSubmission);
            if (data.status >= 400) {
                response.success = false;
                response.recentlySubmitted = false;
                response.code = data.status;

                const parsedError = JSON.parse(data.errorMessage);
                if (parsedError.errors[0].description.trim() === "job already running") {
                    response.httpError = `Job already running`;
                } else if (parsedError.errors[0].description.trim() === "source ID is invalid") {
                    response.httpError = `Source ID is invalid`;
                } else {
                    response.httpError = data.errorMessage;
                }
            } else {
                response.recentlySubmitted = true;
                response.jobNumber = data.job_number;
                logInfo("migration job created successfully");
            }
        } catch (err) {
            return err.toString();
        }
        if (response.success == true) {
            redirect(`/migration/${response.jobNumber}`);
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
