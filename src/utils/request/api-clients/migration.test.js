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
    const accessToken = "token";
    const migrationBody = { status: "complete" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getMigrationJob calls httpGet with the correct URL and auth token", async () => {
        await getMigrationJob("job-1", accessToken);
        expect(httpGet).toHaveBeenCalledWith("http://migration.test/migration-jobs/job-1", accessToken);
    });

    it("getMigrationJobTasks calls httpGet with the correct URL and auth token", async () => {
        await getMigrationJobTasks("job-1", accessToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs/job-1/tasks",
            accessToken
        );
    });

    it("getMigrationsList calls httpGet with the correct URL and auth token", async () => {
        await getMigrationsList("status=active", accessToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs?status=active",
            accessToken
        );
    });

    it("createMigration calls httpPost with the correct URL, auth token and body", async () => {
        await createMigration(migrationBody, accessToken);
        expect(httpPost).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs",
            accessToken,
            migrationBody
        );
    });

    it("updateMigration calls httpPut with the correct URL, auth token and body", async () => {
        await updateMigration("job-1", migrationBody, accessToken);
        expect(httpPut).toHaveBeenCalledWith(
            "http://migration.test/migration-jobs/job-1/state",
            accessToken,
            migrationBody
        );
    });
});
