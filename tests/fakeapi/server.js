import express from "express";

import { datasetList } from "../mocks/datasets.mjs";
import { dataset } from "../mocks/dataset.mjs";
import { editions } from "../mocks/editions.mjs";
import { edition } from "../mocks/edition.mjs";
import { versions } from "../mocks/versions.mjs";


const app = express();
const PORT = 29401;

app.get("/datasets", (req, res) => {
    res.send(datasetList);
});

app.post("/datasets", (req, res) => {
    console.log("working")
    console.log(req)
    console.log(req.body)
    if(req.body.id == 'test dup')
    {
        console.log("yo")
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
    res.send(dataset);
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

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});