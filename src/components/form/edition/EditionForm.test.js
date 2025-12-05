import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";

// mock uuid before importing components that use it
jest.mock("uuid", () => ({
    v4: () => "12345678-1234-1234-1234-123456789012",
}));

import EditionForm from "./EditionForm";

import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));

describe("Edition form", () => {
    test("renders correctly when isNewEdition is false", () => {
        render(<EditionForm datasetID={ "test-dataset" } isNewEdition={ false }  />);

        expect(screen.getByTestId("edition-id")).toBeInTheDocument();
        expect(screen.getByTestId("edition-title")).toBeInTheDocument();
        expect(screen.getByTestId("edition-save-button")).toBeInTheDocument();

        //version fields
        expect(screen.queryByTestId("fieldset-release-date")).not.toBeInTheDocument();
        expect(screen.queryByTestId("select-quality-designation")).not.toBeInTheDocument();
        expect(screen.queryByTestId("quality-designation-radios-item-accredited-official-input")).not.toBeInTheDocument();
        expect(screen.queryByTestId("quality-designation-radios-item-official-input")).not.toBeInTheDocument();
        expect(screen.queryByTestId("quality-designation-radios-item-official-in-development-input")).not.toBeInTheDocument();
        expect(screen.queryByTestId("quality-designation-radios-item-no-accreditation-input")).not.toBeInTheDocument();
        expect(screen.queryByTestId("dataset-upload-input")).not.toBeInTheDocument();
    });

    test("renders correctly when isNewEdition is true", () => {
        render(<EditionForm datasetID={ "test-dataset" } isNewEdition={ true }  />);

        expect(screen.getByTestId("edition-id")).toBeInTheDocument();
        expect(screen.getByTestId("edition-title")).toBeInTheDocument();
        expect(screen.getByTestId("edition-save-button")).toBeInTheDocument();

        //version fields
        expect(screen.getByTestId("fieldset-release-date")).toBeInTheDocument();
        expect(screen.getByTestId("quality-designation-radios-item-accredited-official-input")).toBeInTheDocument();
        expect(screen.getByTestId("quality-designation-radios-item-official-input")).toBeInTheDocument();
        expect(screen.getByTestId("quality-designation-radios-item-official-in-development-input")).toBeInTheDocument();
        expect(screen.getByTestId("quality-designation-radios-item-no-accreditation-input")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-input")).toBeInTheDocument();
    });

    test("renders correctly when edition data is passed in", () => {
        render(<EditionForm datasetID={ "test-dataset" } edition={{edition: "test-edition", edition_title: "Test Edition"}} isNewEdition={ false }  />);

        expect(screen.getByTestId("edition-id").value).toBe("test-edition");
        expect(screen.getByTestId("edition-title").value).toBe("Test Edition");
        expect(screen.getByTestId("edition-save-button")).toBeInTheDocument();
        expect(screen.getByTestId("edition-cancel-button")).toBeInTheDocument();
    });
});
