import Resumable from "resumablejs";
import { httpGet, CSRequestConfig } from "@/utils/request/request";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

const RESUMABLE_OPTIONS = {
    isPublishable: true,
    licence: "Open Government Licence v3.0",
    licenceUrl: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    collectionId: "FAKE-COLLECTION-ID", // hardcoded for POC - needs fixing
    path: "dataset-upload", // hardcoded for POC - needs fixing
};

const routerAPIURL = "http://localhost:23200/v1" //hardcoded for local testing - needs fixing

const bindFileUploadInput = (elementID, handleFileStart, handleFileProgress, handleFileComplete, handleError) => {
    const input = document.getElementById(elementID);
    const r = new Resumable({
        target: `${routerAPIURL}/upload-new`,
        chunkSize: FIVE_MEGABYTES,
        query: {
            aliasName: "",
        },
        forceChunkSize: true,
        simultaneousUploads: 1,
    });
    r.assignBrowse(input);
    r.assignDrop(input);
    r.on("fileAdded", file => {
        const options = {
            ...RESUMABLE_OPTIONS,
            aliasName: file.container.name,
        };
        beginUploadAndUpdateComponentState(r, options, file, handleFileStart);
    });
    r.on("fileProgress", file => {
        updateProgress(file, handleFileProgress);
    });
    r.on("fileError", (file, message) => {
        handleError(message);
    });
    r.on("fileSuccess", file => {
        handleFileComplete(`${r.opts.query.path}/${file.relativePath}`);
    });
};

const beginUploadAndUpdateComponentState = (resumable, resumableOptions, file, handleFileStart) => {
    resumable.opts.query = resumableOptions;
    resumable.upload();
    handleFileStart()
}

const updateProgress = (file, handleFileProgress) => {
    const progressPercentage = Math.round(Number(file.progress() * 100));
    handleFileProgress(progressPercentage);
}

export default bindFileUploadInput;