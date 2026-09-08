jest.mock("../request", () => ({
    httpGet: jest.fn(),
    httpPost: jest.fn(),
    httpPut: jest.fn(),
}));

jest.mock("../../config/config", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        migrationServiceURL: "http://migration.test",
    })),
}));

import { httpGet, httpPost, httpPut } from "../request";
import {
    getMigrationJob,
    getMigrationJobTasks,
    getMigrationsList,
    createMigration,
    updateMigration,
} from "./migration";

describe("migration api client", () => {
    const authToken = "token";
    const migrationBody = { status: "complete" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getMigrationJob calls httpGet with the correct URL and auth token", async () => {
        await getMigrationJob("job-1", authToken);
        expect(httpGet).toHaveBeenCalledWith("http://migration.test/migration-jobs/job-1", authToken);
    });

    it("getMigrationJobTasks calls httpGet with the correct URL and auth token", async () => {
        await getMigrationJobTasks("job-1", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs/job-1/tasks",
            authToken
        );
    });

    it("getMigrationsList calls httpGet with the correct URL and auth token", async () => {
        await getMigrationsList("status=active", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs?status=active",
            authToken
        );
    });

    it("createMigration calls httpPost with the correct URL, auth token and body", async () => {
        await createMigration(migrationBody, authToken);
        expect(httpPost).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs",
            authToken,
            migrationBody
        );
    });

    it("updateMigration calls httpPut with the correct URL, auth token and body", async () => {
        await updateMigration("job-1", migrationBody, authToken);
        expect(httpPut).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs/job-1/state",
            authToken,
            migrationBody
        );
    });
});
