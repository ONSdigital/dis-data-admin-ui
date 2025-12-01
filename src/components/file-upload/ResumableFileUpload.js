"use client";

import { useEffect, useState, useCallback, useRef } from "react";

import bindFileUploadInput from "./bind";

import { TextInput, Summary } from "author-design-system-react";
import { mapUploadedFilesSummary } from "@/components/design-system/summary-mapper";

const progressBarStyle = {
    width: "20rem",
};

export default function ResumableFileUpload({ id = "dataset-upload", uploadBaseURL, label = "File upload", description, validationError, uploadedFiles, datasetID, editionID, versionID }) {
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(validationError || "");
    const [files, setFiles] = useState(uploadedFiles || []);

    const handleFileStart = useCallback(() => {
        setShowProgressBar(true);
        setProgress(0);
        setError(null);
    }, []);

    const handleFileProgress = useCallback((progress) => {
        setShowProgressBar(true);
        setProgress(progress);
        setError(null);
    }, []);

    const handleFileComplete = useCallback((file) => {
        setShowProgressBar(false);
        setProgress(100);
        setError(null);
        // use functional update to avoid race conditions from rapid successive calls
        setFiles((prevFiles) => {
            // prevent duplicate entries when events fire multiple times
            if (prevFiles.some((f) => f.title === file.title)) {
                return prevFiles;
            }
            return [...prevFiles, file];
        });
    }, []);

    const handleError = useCallback((msg) => {
        setShowProgressBar(false);
        setProgress(0);
        setError(msg);
    }, []);

    const handleDeleteClick = (e, deletedFile) => {
        e.preventDefault();
        const filteredFiles = files.filter(file => file.title !== deletedFile);
        setFiles(filteredFiles);
    };

    const resumableInstanceRef = useRef(null);

    useEffect(() => {
        console.log("useEffect running with editionID:", editionID);
        
        // Bind new Resumable instance - this will run every time editionID or other key params change
        // bindFileUploadInput will clean up any existing instance before creating a new one
        const instance = bindFileUploadInput(id, uploadBaseURL, handleFileStart, handleFileProgress, handleFileComplete, handleError, datasetID, editionID, versionID);
        resumableInstanceRef.current = instance;
        
        // Also store config on the input element directly so handlers can always read latest values
        const input = document.getElementById(id.toLowerCase());
        if (input && instance) {
            input._resumableConfig = {
                datasetID,
                editionID,
                versionID,
                uploadBaseURL
            };
            console.log("Stored config on input element:", input._resumableConfig);
        }

        // Cleanup function to remove Resumable instance when component unmounts or dependencies change
        return () => {
            if (resumableInstanceRef.current) {
                try {
                    const input = document.getElementById(id.toLowerCase());
                    if (input && input._resumableInstance) {
                        const instance = input._resumableInstance;
                        // Remove event handlers
                        if (instance._handlers) {
                            if (instance.off) {
                                instance.off("fileAdded", instance._handlers.fileAdded);
                                instance.off("fileProgress", instance._handlers.fileProgress);
                                instance.off("fileError", instance._handlers.fileError);
                                instance.off("fileSuccess", instance._handlers.fileSuccess);
                            }
                            delete instance._handlers;
                        }
                        // Unassign browse/drop if methods exist
                        if (instance.unassignBrowse) {
                            instance.unassignBrowse();
                        }
                        if (instance.unassignDrop) {
                            instance.unassignDrop();
                        }
                        instance.cancel();
                        input._resumableInstance = null;
                    }
                } catch (e) {
                    // Ignore cleanup errors
                }
                resumableInstanceRef.current = null;
            }
        };
        // Include files and error in dependencies so bind runs when files are completed or errors occur
    }, [id, uploadBaseURL, handleFileStart, handleFileProgress, handleFileComplete, handleError, files, error, datasetID, editionID, versionID]);

    useEffect(() => {
        if (validationError) {
            setError(validationError);
        }
    }, [validationError]);

    const renderFileInput = () => {
        return <TextInput id={id} dataTestId={`${id}-input`} classes="ons-input ons-input--text ons-input-type__input ons-input--upload" label={{text: label, description: description}} type="file" value="" error={error}/>;
    };

    const renderFileProgressBar = () => {
        return (
            <>
                <label htmlFor="file-progress" className="ons-label ons-label--with-description">File upload in progress:</label>
                <progress id="file-progress" max="100" style={progressBarStyle} value={progress}>{progress}%</progress>
            </>
        );
    };

    const renderFilesList = () => {
        let content = <p className="ons-u-fs-s" data-testid="dataset-upload-no-files-uploaded-text">No files uploaded</p>;
        if (files.length) {
            const mappedUploadedFiles = mapUploadedFilesSummary(files, handleDeleteClick);
            content = <Summary classes="ons-u-fs-s" summaries={mappedUploadedFiles} />;
        }

        return (
            <div className="ons-u-mt-s">
                <label className="ons-label ons-label--with-description" data-testid="dataset-upload-files-added-label">Files added</label>
                { content }
            </div>
        );
    };
    
    return (
        <div className="ons-col-8@m ons-grid--gutterless">
            <input id={`${id}-value`} data-testid={`${id}-value`} name={`${id}-value`} type="hidden" value={JSON.stringify(files)} />
            { !showProgressBar ? renderFileInput() : null }
            { showProgressBar ? renderFileProgressBar() : null }
            { renderFilesList() }
        </div>
    );
}