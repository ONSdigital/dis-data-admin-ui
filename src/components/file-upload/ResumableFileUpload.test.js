import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ResumableFileUpload from './ResumableFileUpload';

const uploadedFile = {title: "Test dataset", format: "csv", download_url: "test/file/download.csv"};

describe("ResumableFileUpload", () => {
    it("renders correctly in ready state", () => {
        render(<ResumableFileUpload />);
        const hiddenInput = screen.getByTestId("dataset-upload-value");
        expect(hiddenInput).toBeInTheDocument();
        const label = screen.getByTestId("dataset-upload-input-label");
        expect(label).toBeInTheDocument();
        const input = screen.getByTestId("dataset-upload-input");
        expect(input).toBeInTheDocument();
    });

    it("renders custom label and description", () => {
        render(<ResumableFileUpload label="Test file upload label" description="Test file upload description"/>);
        expect(screen.getByText(/Test file upload label/i)).toBeInTheDocument();
        expect(screen.getByText(/Test file upload description/i)).toBeInTheDocument();
    });

    it("renders correctly when a file has been uploaded", () => {
        render(<ResumableFileUpload uploadedFile={uploadedFile}/>);
        const hiddenInput = screen.getByTestId("dataset-upload-value");
        expect(hiddenInput.value).toBe("{\"title\":\"Test dataset\",\"format\":\"csv\",\"download_url\":\"test/file/download.csv\"}");
        expect(screen.getByText(/File has been uploaded/i)).toBeInTheDocument();
        const removeButton = screen.getByTestId("dataset-upload-remove");
        expect(removeButton).toBeInTheDocument();
    });

    it("remove file link works correctly", () => {
        render(<ResumableFileUpload uploadedFile={uploadedFile}/>);
        const hiddenInput = screen.getByTestId("dataset-upload-value");
        expect(hiddenInput.value).toBe("{\"title\":\"Test dataset\",\"format\":\"csv\",\"download_url\":\"test/file/download.csv\"}");

        const removeButton = screen.getByTestId("dataset-upload-remove");
        fireEvent.click(removeButton);

        // distrubution (upload) value iss reset
        expect(hiddenInput.value).toBe("{\"download_url\":\"\"}");
        // view is reset back to default view and ready for new upload
        const input = screen.getByTestId("dataset-upload-input");
        expect(input).toBeInTheDocument();

    });
});