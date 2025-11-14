import express from "express";

import { datasetList } from "../mocks/datasets.mjs";
import { editions } from "../mocks/editions.mjs";
import { versions } from "../mocks/versions.mjs";
import { metadataList } from "../mocks/metadata.mjs";
import { topicList } from "../mocks/topics.mjs";

const app = express();
const PORT = 29401;

const handleMockError = (res, paramID) => {
    if (!paramID || typeof paramID !== "string") {
        return false;
    }

    const errorMap = {
        "400": { status: 400, message: "Bad request" },
        "404": { status: 404, message: "Not found" },
        "500": { status: 500, message: "Internal server error" },
    };

    const error = errorMap[paramID];
    if (error) {
        res.status(error.status).send(error.message);
        return true;
    }

    return false;
};

app.get("/datasets", (req, res) => {
    // check "id" param for search filter
    const datasetID = req.query?.id;
    if (datasetID) {
        const foundDatasets = datasetList.items.filter((item) => item.id === req.query.id);
        if (foundDatasets.length === 0) {
            res.status(404).send("dataset not found");
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
    res.send(paginatedDatasetList);
});

app.post("/datasets", (req, res) => {
    if (req.body.id == "duplicate-id") {
        res.status(409).send("dataset already exists");
        return;
    }

    if (req.body.title == "duplicate-title") {
        res.status(409).send("dataset title already exists");
        return;
    }
    
    res.send({
        id: req.body.id
    });
});

app.put("/datasets/:id", (req, res) => {
    if (req.body.title == "duplicate-title") {
        res.status(409).send("dataset title already exists");
        return;
    }

    res.send({
        title: req.body.title,
        topicList: req.body.topics,
        description: req.body.description,
        contacts: req.body.contacts
    });
});

app.get("/datasets/:id", (req, res) => {
    const dataset = datasetList.items.find(item => item.id === req.params.id);
    if (!dataset) {
        res.status(404).send("dataset not found");
        return;
    }
    res.send(dataset);
});

app.delete("/datasets/:id", (req, res) => {
    if (handleMockError(res, req.params.id)) {
        return;
    }
    res.sendStatus(204);
});

app.get("/datasets/:id/editions", (req, res) => {
    res.send(editions);
});

app.get("/datasets/:id/editions/:editionID", (req, res) => {
    const edition = editions.items.find(item => item.edition === req.params.editionID);
    if (!edition) {
        res.status(404).send("edition not found");
        return;
    }
    res.send(edition);
});

app.get("/datasets/:id/editions/:editionID/versions", (req, res) => {
    res.send({items: versions.items.filter((item => item.edition === req.params.editionID))});
});

app.post("/datasets/:id/editions/:editionID/versions", (req, res) => {
    res.send({
        status: 201,
        version: 1
    });
});

app.get("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    const version = metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
    );
    if (!version) {
        res.status(404).send("version not found");
        return;
    }
    res.send(version);
});

app.put("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    const result = metadataList.items.find(
        (item) =>
            item.id === req.params.id &&
            item.edition === req.params.editionID &&
            item.version === req.params.versionID
    );
    res.send( result || {status: 200} );
});

app.delete("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    if (req.params.versionID === "return-internal-server-error") {
        res.sendStatus(500);
        return;
    }
    res.sendStatus(204);
});

app.get("/datasets/:id/editions/:editionID/versions/:versionID/metadata", (req, res) => {
    const metadata = metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
    );
    if (!metadata) {
        res.status(404).send("metadata not found");
        return;
    }
    res.send(metadata);
});

app.get("/topics/:id", (req, res) => {
    res.send(topicList.items.find(item => item.id === req.params.id));
});

app.get("/topics", (req, res) => {
    res.send(topicList);
});

app.use(express.json());
app.listen(PORT, () => {
    console.log(`Fake API test server running at http://localhost:${PORT}/`);
});