import express from "express";

import { datasetList } from "../mocks/datasets.mjs";

const app = express();
const PORT = 29401;

app.get("/datasets", (req, res) => {
    res.send(datasetList);
});

app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});