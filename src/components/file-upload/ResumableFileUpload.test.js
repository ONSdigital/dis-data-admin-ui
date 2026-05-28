import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

// mock uuid before importing components that use it
jest.mock("uuid", () => ({
    v4: () => "12345678-1234-1234-1234-123456789012",
}));

import ResumableFileUpload from "./ResumableFileUpload";

const uploadedFiles = [
    { title: "Relative dataset title", format: "csv", download_url: "12345678-1234-1234-1234-123456789012/relative.csv" },
    { title: "Absolute dataset title", format: "csv", download_url: "http://localhost:23600/downloads/files/12345678-1234-1234-1234-123456789012/absolute.csv" }
];

describe("ResumableFileUpload", () => {
    it("renders correctly in ready state", () => {
        render(<ResumableFileUpload />);
        expect(screen.getByTestId("dataset-upload-value")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-input-label")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-input")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-input")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-files-added-label")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-no-files-uploaded-text")).toBeInTheDocument();
    });

    it("renders custom label and description", () => {
        render(<ResumableFileUpload label="Test file upload label" description="Test file upload description"/>);
        expect(screen.getByText(/Test file upload label/i)).toBeInTheDocument();
        expect(screen.getByText(/Test file upload description/i)).toBeInTheDocument();
    });

    it("renders correctly when a file has been uploaded", () => {
        render(<ResumableFileUpload uploadedFiles={uploadedFiles}/>);
        expect(screen.getByTestId("dataset-upload-value").value).toBe("[{\"title\":\"Relative dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/relative.csv\"},{\"title\":\"Absolute dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/absolute.csv\"}]");
        expect(screen.getAllByText(/Relative dataset title/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Absolute dataset title/i)[0]).toBeInTheDocument();
        expect(screen.getByTestId("action-link-relative-dataset-title")).toBeInTheDocument();
        expect(screen.getByTestId("action-link-absolute-dataset-title")).toBeInTheDocument();
    });

    it("remove file link works correctly", () => {
        render(<ResumableFileUpload uploadedFiles={uploadedFiles}/>);
        const hiddenInput = screen.getByTestId("dataset-upload-value");
        expect(hiddenInput.value).toBe("[{\"title\":\"Relative dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/relative.csv\"},{\"title\":\"Absolute dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/absolute.csv\"}]");

        const removeButton = screen.getByTestId("action-link-relative-dataset-title");
        fireEvent.click(removeButton);

        // one file remains after removal
        expect(hiddenInput.value).toBe("[{\"title\":\"Absolute dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/absolute.csv\"}]");

        expect(screen.queryByTestId("dataset-upload-no-files-uploaded-text")).not.toBeInTheDocument();
    });
});