"use client";

import { useEffect, useState } from 'react';
import bindFileUploadInput from './bind';

import { TextInput } from "author-design-system-react";

const progressStyle = {
    width: "100%",
    backgroundColor: "--ons-color-branded"

}

const UPLOAD_TEXT_ID = "dataset-upload";

export default function ResumableFileUpload({ children }) {

    const [showFileUpload, setShowFileUpload] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [progress, setProgress] = useState(70);
    const [showIsComplete, setShowIsComplete] = useState(false);
    const [error, setError] = useState();

    const handleFileStart = () => {
        setShowFileUpload(false);
        setShowProgressBar(true);
        setProgress(0);
        setShowIsComplete(false);
        setError(null);
    }

    const handleFileProgress = (progress) => {
        setShowFileUpload(false);
        setShowProgressBar(true);
        setProgress(progress);
        setShowIsComplete(false);
        setError(null);
    }

    const handleFileComplete = () => {
        setShowFileUpload(false);
        setShowProgressBar(false);
        setProgress(100);
        setShowIsComplete(true);
        setError(null);
    }

    const handleError = (msg) => {
        setShowFileUpload(true);
        setShowProgressBar(false);
        setProgress(0);
        setShowIsComplete(false);
        setError(msg)
    }

    useEffect(() => {
        bindFileUploadInput(UPLOAD_TEXT_ID, handleFileStart, handleFileProgress, handleFileComplete, handleError);
    }, []);

    const renderFileInput = () => {
        return <TextInput id={UPLOAD_TEXT_ID} label={{text: "File upload", description: "Click browse or drag file here"}} type="file"/>;
    };

    const renderFileProgressBar = () => {
        return (
            <>
                <label htmlFor="file-progress" className="ons-label ons-label--with-description">File upload in progress:</label>
                <progress id="file-progross" max="100" style={progressStyle} value={progress}>{progress}%</progress>
            </>
        );
    };
    
    return (
        <>
            { showFileUpload ? renderFileInput() : null }
            { showProgressBar ? renderFileProgressBar() : null }
            { showIsComplete ? <p>File has been uploaded.</p> : null }
        </>
    )
}