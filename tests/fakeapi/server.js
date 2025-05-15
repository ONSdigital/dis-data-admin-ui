import express from "express";

import { datasetList } from "../mocks/datasets.mjs";
import { editions } from "../mocks/editions.mjs";
import { edition } from "../mocks/edition.mjs";
import { topicList } from "../mocks/topics.mjs";
import { versions } from "../mocks/versions.mjs";
import { metadataList } from "../mocks/metadata.mjs";


const app = express();
const PORT = 29401;

app.use(express.json())

app.get("/datasets", (req, res) => {
    res.send(datasetList);
});

app.post("/datasets", (req, res) => {
    if(req.body.id == 'test dup'){
        res.send({
            status: 403
        })
    } else {
        res.send({
            id: req.body.id
        });
    }
});

app.get("/datasets/:id", (req, res) => {
    res.send(datasetList.items.find(item => item.id === req.params.id));
});

app.get("/datasets/:id/editions", (req, res) => {
    res.send(editions);
});

app.get("/datasets/:id/editions/:editionID", (req, res) => {
    res.send(edition);
});

app.get("/datasets/:id/editions/:editionID/versions", (req, res) => {
    res.send(versions);
});

app.post("/datasets/:id/editions/:editionID/versions", (req, res) => {
    res.send({status: 201});
});

app.get("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    res.send(
        metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
        )
    );
});

app.put("/datasets/:id/editions/:editionID/versions/:versionID", (req, res) => {
    res.send(
        metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
        )
    );
});

app.get("/datasets/:id/editions/:editionID/versions/:versionID/metadata", (req, res) => {
    res.send(
        metadataList.items.find(
            (item) =>
                item.id === req.params.id &&
                item.edition === req.params.editionID &&
                item.version === req.params.versionID
        )
    );
});

app.get("/topics/:id", (req, res) => {
    res.send(topicList.items.find(item => item.id === req.params.id));
});

app.get("/topics", (req, res) => {
    res.send(topicList);
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});