"use client";

import { useEffect, useState } from "react";

import bindFileUploadInput from "./bind";

import { TextInput, Summary } from "author-design-system-react";
import { mapUploadedFiles } from "@/components/design-system/summary-mapper";

const progressBarStyle = {
    width: "20rem",
};

export default function ResumableFileUpload({ id = "dataset-upload", uploadBaseURL, label = "File upload", description, validationError, uploadedFile, uploadedFiles }) {
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(validationError || "");
    const [file, setFile] = useState(uploadedFile || {});
    const [files, setFiles] = useState(uploadedFiles || []);

    const handleFileStart = () => {
        setShowProgressBar(true);
        setProgress(0);
        setError(null);
    };

    const handleFileProgress = (progress) => {
        setShowProgressBar(true);
        setProgress(progress);
        setError(null);
    };

    const handleFileComplete = (file) => {
        setShowProgressBar(false);
        setProgress(100);
        setError(null);
        setFiles([...files, file])
    };

    const handleError = (msg) => {
        setShowProgressBar(false);
        setProgress(0);
        setError(msg);
    };

    const handleDeleteClick = (e, deletedFile) => {
        e.preventDefault();
        const filteredFiles = files.filter(file => file.title !== deletedFile)
        setFiles(filteredFiles)
    };

    useEffect(() => {
        bindFileUploadInput(id, uploadBaseURL, handleFileStart, handleFileProgress, handleFileComplete, handleError);
    }, [id, uploadBaseURL, validationError]);

    useEffect(() => {
        if (validationError) {
            setError(validationError);
        }
    }, [validationError]);

    const renderFileInput = () => {
        return <TextInput id={id} dataTestId={`${id}-input`} label={{text: label, description: description}} type="file" value="" error={error}/>;
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
        if (!files.length) {
            return;
        }

        const mappedUploadedFiles = mapUploadedFiles(files, handleDeleteClick)
        return (
            <div className="ons-u-mt-s">
                <Summary summaries={mappedUploadedFiles} />
            </div>
        )
    };
    
    return (
        <div className="ons-col-8@m ons-grid--gutterless">
            <input id={`${id}-value`} data-testid={`${id}-value`} name={`${id}-value`} type="hidden" value={JSON.stringify(file)} />
            { !showProgressBar ? renderFileInput() : null }
            { showProgressBar ? renderFileProgressBar() : null }
            { renderFilesList() }
        </div>
    );
}