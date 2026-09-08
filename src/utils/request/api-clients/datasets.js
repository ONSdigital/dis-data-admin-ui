import { httpGet, httpPost, httpPut, httpDelete } from "../request";
import getAppConfig from "../../config/config";

const getApiRouterURL = () => getAppConfig().apiRouterURL;

const getDataset = async (datasetID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}`, authToken);
};

const getDatasetsList = async (query, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets?${query}`, authToken);
};

const createDataset = async (datasetBody, authToken) => {
    return await httpPost(`${getApiRouterURL()}/datasets`, authToken, datasetBody);
};

const updateDataset = async (datasetID, datasetBody, authToken) => {
    return await httpPut(`${getApiRouterURL()}/datasets/${datasetID}`, authToken, datasetBody);
};

const deleteDataset = async (datasetID, authToken) => {
    return await httpDelete(`${getApiRouterURL()}/datasets/${datasetID}`, authToken);
};

const getEditionsList = async (datasetID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions`, authToken);
};

const getEdition = async (datasetID, editionID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}`, authToken);
};

const createEdition = async (datasetID, editionBody, authToken ) => {
    return await httpPost(`${getApiRouterURL()}/datasets/${datasetID}/editions`, authToken, editionBody);
};

const updateEdition = async (datasetID, editionID, editionBody, authToken) => {
    return await httpPut(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}`, authToken, editionBody);
};

const getVersionsList = async (datasetID, editionID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions`, authToken);
};

const getVersion = async (datasetID, editionID, versionID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, authToken);
};

const createVersion = async (datasetID, editionID, versionBody, authToken) => {
    return await httpPost(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions`, authToken, versionBody);
};

const updateVersion = async (datasetID, editionID, versionID, versionBody, authToken ) => {
    return await httpPut(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, authToken, versionBody);
};

const deleteVersion = async (datasetID, editionID, versionID, authToken) => {
    return await httpDelete(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, authToken);
};

const getMetadata = async (datasetID, editionID, versionID, authToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}/metadata`, authToken);
};

export {
    getDataset,
    getDatasetsList,
    createDataset,
    updateDataset,
    deleteDataset,
    getEditionsList,
    getEdition,
    createEdition,
    updateEdition,
    getVersionsList,
    getVersion,
    createVersion,
    updateVersion,
    deleteVersion,
    getMetadata,
};
