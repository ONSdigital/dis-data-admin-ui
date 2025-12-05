import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"

jest.mock("uuid", () => ({
    v4: () => "12345678-1234-1234-1234-123456789012",
}));

import ResumableFileUpload from "./ResumableFileUpload";

const uploadedFile = [{title: "Test dataset title", format: "csv", download_url: "12345678-1234-1234-1234-123456789012/download.csv"}];

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
        render(<ResumableFileUpload uploadedFiles={uploadedFile}/>);
        expect(screen.getByTestId("dataset-upload-value").value).toBe("[{\"title\":\"Test dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/download.csv\"}]");
        expect(screen.getAllByText(/Test dataset title/i)[0]).toBeInTheDocument();
        expect(screen.getByTestId("action-link-test-dataset-title")).toBeInTheDocument();
    });

    it("remove file link works correctly", () => {
        render(<ResumableFileUpload uploadedFiles={uploadedFile}/>);
        const hiddenInput = screen.getByTestId("dataset-upload-value");
        expect(hiddenInput.value).toBe("[{\"title\":\"Test dataset title\",\"format\":\"csv\",\"download_url\":\"12345678-1234-1234-1234-123456789012/download.csv\"}]");

        const removeButton = screen.getByTestId("action-link-test-dataset-title");
        fireEvent.click(removeButton);

        // distrubution (upload) value is reset
        expect(hiddenInput.value).toBe("[]");

        expect(screen.getByTestId("dataset-upload-no-files-uploaded-text")).toBeInTheDocument();
    });
});