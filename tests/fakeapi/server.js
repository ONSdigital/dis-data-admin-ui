import express from "express";

import { datasetList } from "../mocks/datasets.mjs";
import { editions } from "../mocks/editions.mjs";
import { versions } from "../mocks/versions.mjs";
import { metadataList } from "../mocks/metadata.mjs";
import { topicList } from "../mocks/topics.mjs";

const app = express();
const PORT = 29401;

app.use(express.json());

const log = (msg, url, status) => {
    if (!process.env.ENABLE_LOGGING) return;
    const log = { 
        message: msg, 
        url: url,
        status: status || 0
    };
    console.log(JSON.stringify(log));
};

const handleMockError = (req, res, paramID) => {
    if (!paramID || typeof paramID !== "string") {
        return false;
    }

    const errorMap = {
        "400": { status: 400, message: "Bad request" },
        "401": { status: 400, message: "Unauthorised" },
        "404": { status: 404, message: "Not found" },
        "500": { status: 500, message: "Internal server error" },
    };

    const error = errorMap[paramID];
    if (error) {
        log("Returning mocked error", req.url, error.status);
        res.status(error.status).send(error.message);
        return true;
    }

    return false;
};

app.get("/datasets", (req, res) => {
    log("Handling GET '/datasets'", req.url, null);

    // check "id" param for search filter
    const datasetID = req.query?.id;
    if (datasetID) {
        const foundDatasets = datasetList.items.filter((item) => item.id === req.query.id);
        if (foundDatasets.length === 0) {
            log("Dataset not found", req.url, 404);
            res.status(404).send("Dataset not found");
            return;
        }
        const result = {items: foundDatasets, total_count: foundDatasets.length};
        res.send(result);
        return;
    }
    const offset = req.query?.offset || 0;
    const limit = req.query?.limit || 20;
    const paginatedDatasetList = {};
    paginatedDatasetList.items = datasetList.items.slice(offset, (+limit + +offset));
    paginatedDatasetList.total_count = datasetList.total_count;
    paginatedDatasetList.count = datasetList.count;
    paginatedDatasetList.offset = offset;

    log("Returning success", req.url, 200);
    res.send(paginatedDatasetList);
});

app.post("/datasets", (req, res) => {
    log("Handling POST '/datasets'", req.url, null);

    if (req.body.id == "duplicate-id") {
        log("Returning success", req.url, 409);
        res.status(409).send("dataset already exists");
        return;
    }

    if (req.body.title == "duplicate-title") {
        log("Dataset title already exists", req.url, 409);
        res.status(409).send("dataset title already exists");
        return;
    }
    
    log("Returning success", req.url, 201);
    res.send({
        id: req.body.id
    });
});

app.put("/datasets/:id", (req, res) => {
    log("Handling PUT '/datasets'", req.url, null);

    if (req.body.title == "duplicate-title") {
        log("Dataset title already exists", req.url, 409);
        res.status(409).send("dataset title already exists");
        return;
    }

    log("Returning success", req.url, 200);
    res.send({
        title: req.body.title,
        topicList: req.body.topics,
        description: req.body.description,
        contacts: req.body.contacts
    });
});

app.get("/datasets/:id", (req, res) => {
    log("Handling GET '/datasets/:id'", req.url, null);
    if (handleMockError(req, res, req.params.id)) return;

    const dataset = datasetList.items.find(item => item.id === req.params.id);
    if (!dataset) {
        log("Dataset not found", req.url, 404);
        res.status(404).send("Dataset not found");
        return;
    }

    log("Returning success", req.url, 200);
    res.send(dataset);
});

app.delete("/datasets/:id", (req, res) => {
    log("Handling DELETE '/datasets/:id'", req.url, null);
    if (handleMockError(req, res, req.params.id)) return;
    
    log("Returning success", req.url, 204);
    res.sendStatus(204);
});

app.get("/datasets/:id/editions", (req, res) => {
    log("Handling GET '/datasets/:id/editions'", req.url, null);
    
    log("Returning success", req.url, 200);
    res.send(editions);
});

app.get("/datasets/:id/editions/:editionID", (req, res) => {
    log("Handling GET '/datasets/:id/editions/:editionID'", req.url, null);

    const edition = editions.items.find(item => item.edition === req.params.editionID);
    if (!edition) {
        log("Edition not found", req.url, 404);
        res.status(404).send("Edition not found");
        return;
    }

    log("Returning success", req.url, 200);
    res.send(edition);
});

app.get("/datasets/:id/editions/:editionID/versions", (req, res) => {
    log("Handling GET '/datasets/:id/editions/:editionID/versions'", req.url, null);

    log("Returning success", req.url, 200);
    res.send({items: versions.items.filter((item => item.edition === req.params.editionID))});
});

app.post("/datasets/:id/editions/:editionID/versions", (req, res) => {
    log("Handling POST '/datasets/:id/editions/:editionID/versions'", req.url, null);

    log("Returning success", req.url, 201);
    res.send({
        status: 201,
        version: 1
    });
});

app.get("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    log("Handling GET '/datasets/:id/editions/:editionID/versions/:versionID'", req.url, null);
    const version = metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
    );
    if (!version) {
        log("Version not found", req.url, 404);
        res.status(404).send("Version not found");
        return;
    }

    log("Returning success", req.url, 200);
    res.send(version);
});

app.put("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    log("Handling PUT '/datasets/:id/editions/:editionID/versions/:versionID'", req.url, null);
    const result = metadataList.items.find(
        (item) =>
            item.id === req.params.id &&
            item.edition === req.params.editionID &&
            item.version === req.params.versionID
    );

    log("Returning success", req.url, 200);
    res.send( result || {status: 200} );
});

app.delete("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    log("Handling DELETE '/datasets/:id/editions/:editionID/versions/:versionID'", req.url, null);
    if (req.params.versionID === "return-internal-server-error") {
        res.sendStatus(500);
        return;
    }
    log("Returning success", req.url, 204);
    res.sendStatus(204);
});

app.get("/datasets/:id/editions/:editionID/versions/:versionID/metadata", (req, res) => {
    log("Handling GET '/datasets/:id/editions/:editionID/versions/:versionID/metadata'", req.url, null);

    const metadata = metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
    );
    if (!metadata) {
        log("Metadata not found", req.url, 404);
        res.status(404).send("Metadata not found");
        return;
    }

    log("Returning success", req.url, 200);
    res.send(metadata);
});

app.get("/topics", (req, res) => {
    log("Handling GET '/topics'", req.url, null);

    log("Returning success", req.url, 200);
    res.send(topicList);
});

app.get("/topics/:id", (req, res) => {
    log("Handling GET '/topics/:id'", req.url, null);

    log("Returning success", req.url, 200);
    res.send(topicList.items.find(item => item.id === req.params.id));
});

app.listen(PORT, () => {
    console.log(`Fake API test server running at http://localhost:${PORT}/`);
});