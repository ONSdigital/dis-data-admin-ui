import { httpGet, httpPut, httpPost } from "../request";
import getAppConfig from "../../config/config";

const getMigrationServiceURL = () => getAppConfig().migrationServiceURL;

const getMigrationJob = async (jobID, accessToken) => {
    return await httpGet(`${getMigrationServiceURL()}/migration-jobs/${jobID}`, accessToken);
};

const getMigrationJobTasks = async (jobID, accessToken) => {
    return await httpGet(`${getMigrationServiceURL()}/migration-jobs/${jobID}/tasks`, accessToken);
};

const getMigrationsList = async (query, accessToken) => {
    return await httpGet(`${getMigrationServiceURL()}/migration-jobs?${query}`, accessToken);
};

const createMigration = async (migrationBody, accessToken) => {
    return await httpPost(`${getMigrationServiceURL()}/migration-jobs`, accessToken, migrationBody);
};

const updateMigration = async (jobID, migrationBody, accessToken) => {
    return await httpPut(`${getMigrationServiceURL()}/migration-jobs/${jobID}/state`, accessToken, migrationBody);
};

export { getMigrationsList, getMigrationJob, getMigrationJobTasks, createMigration, updateMigration };
