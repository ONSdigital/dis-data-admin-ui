import Resumable from "resumablejs";
import { logError } from "@/utils/log/log";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

const RESUMABLE_OPTIONS = {
    isPublishable: true,
    licence: "Open Government Licence v3.0",
    licenceUrl: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
};

const bindFileUploadInput = (elementID, uploadBaseURL, uploadFilePath, handleFileStart, handleFileProgress, handleFileComplete, handleError) => {
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
        fileType: ["csdb", "csv", "csvw", "sdmx", "xls", "xlsx"],
        forceChunkSize: true,
        simultaneousUploads: 1,
        permanentErrors: [400, 404, 409, 415, 500, 501],
    });
    r.assignBrowse(input);
    r.assignDrop(input);
    r.on("fileAdded", file => {
        const options = {
            ...RESUMABLE_OPTIONS,
            path: uploadFilePath,
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

const onFileError = (uploadError, handleError) => {
    let error = {
        id: "upload-error"
    };

    let parsedError;
    try {
        parsedError = JSON.parse(uploadError);
    } catch (err) {
        logError("failed to parse upload error message", null, null, err);
        error.text = uploadError;
        handleError(error);
        return;
    }
    
    switch (parsedError.errors[0].code) {
        case "DuplicateFile":
            error.text = "A file with this name already exists";
            break;
        case "ChunkTooSmall":
            error.text = "A chunk of this file was too small";
            break;
        case "Unauthorised":
            error.text = "You are unauthorised to upload this file or to this location";
            break;
        default:
            error.text = parsedError.errors[0].description;
    }
    handleError(error);
};

const onFileSuccess = (resumable, file, handleFileComplete) => {
    const fileInfo = {
        title: file.fileName,
        download_url: `${resumable.opts.query.path}/${file.relativePath}`,
        byte_size: file.size,
        format: formatFromFilename(file.fileName),
    };
    handleFileComplete(fileInfo);
};

const formatFromFilename = (filename) => {
    return filename.split(".").pop();
};

export default bindFileUploadInput;
export { onFileAdded, onFileProgress, onFileError, onFileSuccess };