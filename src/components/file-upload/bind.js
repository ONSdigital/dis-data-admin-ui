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
    console.log(input);
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
        console.log("FILE ADDED!!");
    });
    r.on("fileProgress", file => {
        updateProgress(file, handleFileProgress);
        console.log("FILE PROGRESS");
    });
    r.on("fileError", file => {
        handleErrorAndUpdateComponentState(file, handleError);
        console.log("FILE ERROR")
    });
    r.on("fileSuccess", file => {
        //onSuccess(`${r.opts.query.path}/${file.relativePath}`);
        console.log("FILE SUCCESS")
    });
};

const beginUploadAndUpdateComponentState = (resumable, resumableOptions, file, handleFileStart) => {
    const aliasName = file.container.name;
    resumable.opts.query = resumableOptions;
    resumable.upload();

    console.log("UPLOAD RAN!!")
    // const fileUpload = {
    //     aliasName: aliasName,
    //     progress: 0,
    //     error: null,
    //     filename: file.fileName,
    // };
    handleFileStart()
    //updateState(fileUpload);
}

const updateProgress = (file, handleFileProgress) => {
    const progressPercentage = Math.round(Number(file.progress() * 100));
    // const fileUpload = {
    //     progress: progressPercentage,
    //     filename: file.fileName,
    // };
    handleFileProgress(progressPercentage);
    //updateState(fileUpload);
}

// const updateComponentState = (file, updateState) => {
//     const progressPercentage = Math.round(Number(file.progress() * 100));
//     const fileUpload = {
//         progress: progressPercentage,
//         filename: file.fileName,
//     };
//     updateState(fileUpload);
// }

const handleErrorAndUpdateComponentState = (file, handleError) => {
    // const fileUpload = {
    //     error: "An error occurred whilst uploading this file.",
    //     filename: file.fileName,
    // };

    console.error("Error uploading file to server");

    handleError("An error occurred whilst uploading this file.");
}

const handleSuccessGetFileUploadedFileInfoAndUpdateComponentState = (file, updateState, onSuccess) => {
    const aliasName = file.resumableObj.opts.query.aliasName;
    const reqCfg = CSRequestConfig();
    console.log(reqCfg)
    httpGet(`/upload/${file.uniqueIdentifier}`)
        .then(response => {
            const fileUpload = {
                aliasName: aliasName,
                progress: 0,
                url: response.url,
                filename: file.fileName,
            };

            updateState(fileUpload);

            onSuccess(response.url);
        })
        .catch(error => {
            const fileUpload = {
                error: "An error occurred whilst uploading this file",
                filename: file.fileName,
            };

            console.error("Error fetching uploaded file's URL: ", error);
            updateState(fileUpload);
        });
}

export default bindFileUploadInput;