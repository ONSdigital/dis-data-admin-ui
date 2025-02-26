import Resumable from "resumablejs";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

const RESUMABLE_OPTIONS = {
    isPublishable: true,
    licence: "Open Government Licence v3.0",
    licenceUrl: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    collectionId: "FAKE-COLLECTION-ID", // hardcoded for POC - needs fixing
    path: "dataset-upload", // hardcoded for POC - needs fixing
};

const bindFileUploadInput = (elementID, handleFileStart, handleFileProgress, handleFileComplete, handleError) => {
    const input = document.getElementById(elementID);
    const uploadURL = "/upload";
    const r = new Resumable({
        target: uploadURL,
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
        onFileAdded(r, options, file, handleFileStart);
    });
    r.on("fileProgress", file => {
        onFileProgress(file, handleFileProgress);
    });
    r.on("fileError", (file, message) => {
        onFileError(message, handleError);
    });
    r.on("fileSuccess", file => {
        onFileSuccess(r, file, handleFileComplete);
    });
};

const onFileAdded = (resumable, resumableOptions, file, handleFileStart) => {
    resumable.opts.query = resumableOptions;
    resumable.upload();
    handleFileStart();
};

const onFileProgress = (file, handleFileProgress) => {
    const progressPercentage = Math.round(Number(file.progress() * 100));
    handleFileProgress(progressPercentage);
};

const onFileError = (message, handleError) => {
    handleError(message);
};

const onFileSuccess = (resumable, file, handleFileComplete) => {
    handleFileComplete(`${resumable.opts.query.path}/${file.relativePath}`);
};

export default bindFileUploadInput;
export { onFileAdded, onFileProgress, onFileError, onFileSuccess };