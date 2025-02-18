"use client";

import ResumableFileUpload from "@/components/file-upload/ResumableFileUpload";

export default function Upload() {
    return (
        <>
            <h1>Upload (POC)</h1>
            <p>This is the temporary home for our upload component until the dataset series journey is fully mapped out/ready.</p>

            <ResumableFileUpload id="poc-dataset-upload" label="File upload" description="Click browse or drag file here"/>
        </>
    );
};
