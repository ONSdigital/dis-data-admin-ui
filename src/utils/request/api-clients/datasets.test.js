jest.mock("../request", () => ({
    httpGet: jest.fn(),
    httpPost: jest.fn(),
    httpPut: jest.fn(),
    httpDelete: jest.fn(),
}));

jest.mock("../../config/config", () => ({
    __esModule: true,
    default: jest.fn(() => ({
        apiRouterURL: "http://api.test",
    })),
}));

import { httpGet, httpPost, httpPut, httpDelete } from "../request";
import {
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
} from "./datasets";

describe("datasets api client", () => {
    const authToken = "token";
    const datasetBody = { title: "Dataset" };
    const editionBody = { title: "Edition" };
    const versionBody = { title: "Version" };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("getDataset calls httpGet with the correct URL and auth token", async () => {
        await getDataset("dataset-1", authToken);
        expect(httpGet).toHaveBeenCalledWith("http://api.test/datasets/dataset-1", authToken);
    });

    it("getDatasetsList calls httpGet with the correct URL and auth token", async () => {
        await getDatasetsList("limit=10", authToken);
        expect(httpGet).toHaveBeenCalledWith("http://api.test/datasets?limit=10", authToken);
    });

    it("createDataset calls httpPost with the correct URL, auth token and body", async () => {
        await createDataset(datasetBody, authToken);
        expect(httpPost).toHaveBeenCalledWith("http://api.test/datasets", authToken, datasetBody);
    });

    it("updateDataset calls httpPut with the correct URL, auth token and body", async () => {
        await updateDataset("dataset-1", datasetBody, authToken);
        expect(httpPut).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1",
            authToken,
            datasetBody
        );
    });

    it("deleteDataset calls httpDelete with the correct URL and auth token", async () => {
        await deleteDataset("dataset-1", authToken);
        expect(httpDelete).toHaveBeenCalledWith("http://api.test/datasets/dataset-1", authToken);
    });

    it("getEditionsList calls httpGet with the correct URL and auth token", async () => {
        await getEditionsList("dataset-1", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions",
            authToken
        );
    });

    it("getEdition calls httpGet with the correct URL and auth token", async () => {
        await getEdition("dataset-1", "edition-1", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1",
            authToken
        );
    });

    it("createEdition calls httpPost with the correct URL, auth token and body", async () => {
        await createEdition("dataset-1", editionBody, authToken);
        expect(httpPost).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions",
            authToken,
            editionBody
        );
    });

    it("updateEdition calls httpPut with the correct URL, auth token and body", async () => {
        await updateEdition("dataset-1", "edition-1", editionBody, authToken);
        expect(httpPut).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1",
            authToken,
            editionBody
        );
    });

    it("getVersionsList calls httpGet with the correct URL and auth token", async () => {
        await getVersionsList("dataset-1", "edition-1", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1/versions",
            authToken
        );
    });

    it("getVersion calls httpGet with the correct URL and auth token", async () => {
        await getVersion("dataset-1", "edition-1", "version-1", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1/versions/version-1",
            authToken
        );
    });

    it("createVersion calls httpPost with the correct URL, auth token and body", async () => {
        await createVersion("dataset-1", "edition-1", versionBody, authToken);
        expect(httpPost).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1/versions",
            authToken,
            versionBody
        );
    });

    it("updateVersion calls httpPut with the correct URL, auth token and body", async () => {
        await updateVersion("dataset-1", "edition-1", "version-1", versionBody, authToken);
        expect(httpPut).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1/versions/version-1",
            authToken,
            versionBody
        );
    });

    it("deleteVersion calls httpDelete with the correct URL and auth token", async () => {
        await deleteVersion("dataset-1", "edition-1", "version-1", authToken);
        expect(httpDelete).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1/versions/version-1",
            authToken
        );
    });

    it("getMetadata calls httpGet with the correct URL and auth token", async () => {
        await getMetadata("dataset-1", "edition-1", "version-1", authToken);
        expect(httpGet).toHaveBeenCalledWith(
            "http://api.test/datasets/dataset-1/editions/edition-1/versions/version-1/metadata",
            authToken
        );
    });
});
