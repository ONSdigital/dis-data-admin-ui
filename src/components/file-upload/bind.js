import Resumable from "resumablejs";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

const RESUMABLE_OPTIONS = {
    isPublishable: true,
    licence: "Open Government Licence v3.0",
    licenceUrl: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
    path: "dataset-upload", // hardcoded for POC - needs fixing
};

const bindFileUploadInput = (elementID, uploadBaseURL, handleFileStart, handleFileProgress, handleFileComplete, handleError) => {
    // we lower case ID values here because if an upper case values are in ID they will get santised and lowercased 
    // by the <TextInput /> component from eq-author and there will be errors when trying to bind
    const elID = elementID.toLowerCase();
    
    const input = document.getElementById(elID);
    if (!input) {
        return;
    };
    const uploadURL = uploadBaseURL + "/upload-new";
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
    const fileInfo = {
        download_url: `${resumable.opts.query.path}/${file.relativePath}`,
        byte_size: file.size,
        media_type: file.file.type
    };
    handleFileComplete(fileInfo);
};

export default bindFileUploadInput;
export { onFileAdded, onFileProgress, onFileError, onFileSuccess };