"use client";

import { useEffect, useState } from 'react';
import bindFileUploadInput from './bind';

import { TextInput } from "author-design-system-react";

const progressStyle = {
    width: "20rem",
};

export default function ResumableFileUpload({ id = "dataset-upload", label = "File upload", description, uploadBaseURL }) {

    const [showFileUpload, setShowFileUpload] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showIsComplete, setShowIsComplete] = useState(false);
    const [error, setError] = useState();
    const [file, setFile] = useState();

    const handleFileStart = () => {
        setShowFileUpload(false);
        setShowProgressBar(true);
        setProgress(0);
        setShowIsComplete(false);
        setError(null);
        setFile(null);
    };

    const handleFileProgress = (progress) => {
        setShowFileUpload(false);
        setShowProgressBar(true);
        setProgress(progress);
        setShowIsComplete(false);
        setError(null);
        setFile(null);
    };

    const handleFileComplete = (file) => {
        setShowFileUpload(false);
        setShowProgressBar(false);
        setProgress(100);
        setShowIsComplete(true);
        setError(null);
        setFile(file);
    };

    const handleError = (msg) => {
        setShowFileUpload(true);
        setShowProgressBar(false);
        setProgress(0);
        setShowIsComplete(false);
        setError(msg);
        setFile(null);
    };

    useEffect(() => {
        bindFileUploadInput(id, uploadBaseURL, handleFileStart, handleFileProgress, handleFileComplete, handleError);
    }, [id, uploadBaseURL]);

    const renderFileInput = () => {
        return <TextInput id={id} label={{text: label, description: description}} type="file"/>;
    };

    const renderFileProgressBar = () => {
        return (
            <>
                <label htmlFor="file-progress" className="ons-label ons-label--with-description">File upload in progress:</label>
                <progress id="file-progress" max="100" style={progressStyle} value={progress}>{progress}%</progress>
            </>
        );
    };
    
    return (
        <>
            { error ? <p style={{color: "red"}}>{ error }</p> : null}
            { showFileUpload ? renderFileInput() : null }
            { showProgressBar ? renderFileProgressBar() : null }
            { showIsComplete ? <p>File has been uploaded: {file}</p> : null }
        </>
    );
}