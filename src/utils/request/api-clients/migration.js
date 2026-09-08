import { httpGet, httpPut, httpPost } from "../request";
import getAppConfig from "../../config/config";

const getMigrationServiceURL = () => getAppConfig().migrationServiceURL;

const getMigrationJob = async (jobID, authToken) => {
    return await httpGet(`${getMigrationServiceURL()}/migration-jobs/${jobID}`, authToken);
};

const getMigrationJobTasks = async (jobID, authToken) => {
    return await httpGet(`${getMigrationServiceURL()}/migration-jobs/${jobID}/tasks`, authToken);
}

const getMigrationsList = async (query, authToken) => {
    return await httpGet(`${getMigrationServiceURL()}/migration-jobs?${query}`, authToken);
};

const createMigration = async (migrationBody, authToken) => {
    return await httpPost(`${getMigrationServiceURL()}/migration-jobs`, authToken, migrationBody);
};

const updateMigration = async (jobID, migrationBody, authToken) => {
    return await httpPut(`${getMigrationServiceURL()}/migration-jobs/${jobID}/state`, authToken, migrationBody);
};

export { getMigrationsList, getMigrationJob, getMigrationJobTasks, createMigration, updateMigration };
