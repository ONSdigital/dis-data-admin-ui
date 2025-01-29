import express from "express";

import { datasetList } from "../mocks/datasets.mjs";
import { dataset } from "../mocks/dataset.mjs";
import { editions } from "../mocks/editions.mjs";

const app = express();
const PORT = 29401;

app.get("/series", (req, res) => {
    res.send(datasetList);
});

app.get("/series/:id", (req, res) => {
    res.send(dataset);
});

app.get("/series/:id/editions", (req, res) => {
    res.send(editions);
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});