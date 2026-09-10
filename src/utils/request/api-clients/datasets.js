import { httpGet, httpPost, httpPut, httpDelete } from "../request";
import getAppConfig from "../../config/config";

const getApiRouterURL = () => getAppConfig().apiRouterURL;

const getDataset = async (datasetID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}`, accessToken);
};

const getDatasetsList = async (query, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets?${query}`, accessToken);
};

const createDataset = async (datasetBody, accessToken) => {
    return await httpPost(`${getApiRouterURL()}/datasets`, accessToken, datasetBody);
};

const updateDataset = async (datasetID, datasetBody, accessToken) => {
    return await httpPut(`${getApiRouterURL()}/datasets/${datasetID}`, accessToken, datasetBody);
};

const deleteDataset = async (datasetID, accessToken) => {
    return await httpDelete(`${getApiRouterURL()}/datasets/${datasetID}`, accessToken);
};

const getEditionsList = async (datasetID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions`, accessToken);
};

const getEdition = async (datasetID, editionID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}`, accessToken);
};

const createEdition = async (datasetID, editionBody, accessToken ) => {
    return await httpPost(`${getApiRouterURL()}/datasets/${datasetID}/editions`, accessToken, editionBody);
};

const updateEdition = async (datasetID, editionID, editionBody, accessToken) => {
    return await httpPut(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}`, accessToken, editionBody);
};

const getVersionsList = async (datasetID, editionID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions`, accessToken);
};

const getVersion = async (datasetID, editionID, versionID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, accessToken);
};

const createVersion = async (datasetID, editionID, versionBody, accessToken) => {
    return await httpPost(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions`, accessToken, versionBody);
};

const updateVersion = async (datasetID, editionID, versionID, versionBody, accessToken ) => {
    return await httpPut(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, accessToken, versionBody);
};

const deleteVersion = async (datasetID, editionID, versionID, accessToken) => {
    return await httpDelete(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`, accessToken);
};

const getMetadata = async (datasetID, editionID, versionID, accessToken) => {
    return await httpGet(`${getApiRouterURL()}/datasets/${datasetID}/editions/${editionID}/versions/${versionID}/metadata`, accessToken);
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
