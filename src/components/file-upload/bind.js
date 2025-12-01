import Resumable from "resumablejs";
import { logError } from "@/utils/log/log";

const FIVE_MEGABYTES = 5 * 1024 * 1024;

const RESUMABLE_OPTIONS = {
    isPublishable: true,
    licence: "Open Government Licence v3.0",
    licenceUrl: "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
};

const bindFileUploadInput = (elementID, uploadBaseURL, handleFileStart, handleFileProgress, handleFileComplete, handleError, datasetID, editionID, versionID) => {
    // we lower case ID values here because if an upper case values are in ID they will get santised and lowercased 
    // by the <TextInput /> component from eq-author and there will be errors when trying to bind
    const elID = elementID.toLowerCase();
    
    console.log("bindFileUploadInput called with editionID:", editionID);
    console.log("All params:", { elementID, datasetID, editionID, versionID });
    
    if (!editionID) {
        console.warn("WARNING: editionID is null/undefined when binding Resumable. This may cause issues.");
    }
    
    const input = document.getElementById(elID);
    if (!input) {
        console.warn("Input element not found for ID:", elID);
        return null;
    }

    // Clean up any existing Resumable instance on this input element
    let actualInput = input;
    if (input._resumableInstance) {
        console.log("Cleaning up existing Resumable instance");
        console.log("Old instance had editionID:", input._resumableInstance._config?.editionID);
        try {
            const oldInstance = input._resumableInstance;
            // Remove all event listeners before canceling
            if (oldInstance.off) {
                oldInstance.off("fileAdded");
                oldInstance.off("fileProgress");
                oldInstance.off("fileError");
                oldInstance.off("fileSuccess");
            }
            oldInstance.cancel();
        } catch (e) {
            console.error("Error cleaning up Resumable instance:", e);
        }
        
        // Clone the input element to remove all DOM event listeners that assignBrowse/assignDrop attached
        // This ensures a clean slate for the new Resumable instance
        const parent = input.parentNode;
        if (parent) {
            const newInput = input.cloneNode(true);
            parent.replaceChild(newInput, input);
            // Use the new cloned input element
            actualInput = newInput;
        }
    }
    
    console.log("About to create Resumable instance with editionID:", editionID);

    const uploadURL = uploadBaseURL + "/upload-new";
    const r = new Resumable({
        target: uploadURL,
        chunkSize: FIVE_MEGABYTES,
        query: {
            aliasName: "",
        },
        forceChunkSize: true,
        simultaneousUploads: 1,
        permanentErrors: [400, 404, 409, 415, 500, 501],
    });

    // Store the current values on both the Resumable instance AND the input element
    // This ensures handlers can always read the latest values, even if the instance is recreated
    r._config = {
        datasetID,
        editionID,
        versionID,
        uploadBaseURL
    };
    
    // Also store on the input element so handlers can always read current values
    actualInput._resumableConfig = {
        datasetID,
        editionID,
        versionID,
        uploadBaseURL
    };

    // Create handler functions that read values from the input element (which always has latest values)
    // This ensures they always get the current values, not stale closure values
    const fileAddedHandler = (file) => {
        // Get the input element from the DOM using the element ID
        // This ensures we always read the most current config values
        const currentInput = document.getElementById(elID);
        const config = currentInput?._resumableConfig || r._config || {};
        const currentEditionID = config.editionID;
        const currentDatasetID = config.datasetID;
        const currentVersionID = config.versionID;
        
        console.log("fileAddedHandler - Reading from DOM input element:", currentInput);
        console.log("fileAddedHandler - Reading from input element config:", currentInput?._resumableConfig);
        console.log("fileAddedHandler - Reading from instance config:", r._config);
        console.log("EditionID in handler:", currentEditionID);
        
        if (!currentEditionID) {
            console.error("ERROR: editionID is null/undefined in fileAddedHandler!");
            console.error("Available config sources:", {
                inputConfig: currentInput?._resumableConfig,
                instanceConfig: r._config
            });
        }
        
        const options = {
            ...RESUMABLE_OPTIONS,
            path: `${currentDatasetID}/${currentEditionID}/${currentVersionID}`,
            aliasName: file.container.name,
        };
        console.log("Options are:", options);
        onFileAdded(r, options, file, handleFileStart);
    };

    const fileProgressHandler = (file) => {
        onFileProgress(file, handleFileProgress);
    };

    const fileErrorHandler = (file, message) => {
        onFileError(message, handleError);
    };

    const fileSuccessHandler = (file) => {
        onFileSuccess(r, file, handleFileComplete);
    };

    // Assign event handlers
    r.on("fileAdded", fileAddedHandler);
    r.on("fileProgress", fileProgressHandler);
    r.on("fileError", fileErrorHandler);
    r.on("fileSuccess", fileSuccessHandler);

    // Store handlers on the instance for cleanup
    r._handlers = {
        fileAdded: fileAddedHandler,
        fileProgress: fileProgressHandler,
        fileError: fileErrorHandler,
        fileSuccess: fileSuccessHandler
    };

    r.assignBrowse(actualInput);
    r.assignDrop(actualInput);

    // Store the Resumable instance on the input element for cleanup
    actualInput._resumableInstance = r;
    
    console.log("Resumable instance created and stored. Config is:", r._config);

    return r;
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
        media_type: file.file.type
    };
    handleFileComplete(fileInfo);
};

export default bindFileUploadInput;
export { onFileAdded, onFileProgress, onFileError, onFileSuccess };