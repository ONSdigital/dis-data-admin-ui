import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import EditionForm from "./EditionForm";

describe("Edition form", () => {
    test("renders correctly when isNewEdition is false", () => {
        render(<EditionForm datasetID={ "test-dataset" } isNewEdition={ false }  />);

        expect(screen.getByTestId("edition-id")).toBeInTheDocument();
        expect(screen.getByTestId("edition-title")).toBeInTheDocument();
        expect(screen.getByTestId("edition-save-button")).toBeInTheDocument();

        //version fields
        expect(screen.queryByTestId("fieldset-release-date")).not.toBeInTheDocument();
        expect(screen.queryByTestId("select-quality-designation")).not.toBeInTheDocument();
        expect(screen.queryByTestId("dataset-upload-input")).not.toBeInTheDocument();
    });

    test("renders correctly when isNewEdition is true", () => {
        render(<EditionForm datasetID={ "test-dataset" } isNewEdition={ true }  />);

        expect(screen.getByTestId("edition-id")).toBeInTheDocument();
        expect(screen.getByTestId("edition-title")).toBeInTheDocument();
        expect(screen.getByTestId("edition-save-button")).toBeInTheDocument();

        //version fields
        expect(screen.getByTestId("fieldset-release-date")).toBeInTheDocument();
        expect(screen.getByTestId("select-quality-designation")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-upload-input")).toBeInTheDocument();
    });

    test("renders correctly when edition data is passed in", () => {
        render(<EditionForm datasetID={ "test-dataset" } edition={{edition: "test-edition", edition_title: "Test Edition"}} isNewEdition={ false }  />);

        expect(screen.getByTestId("edition-id").value).toBe("test-edition");
        expect(screen.getByTestId("edition-title").value).toBe("Test Edition");
        expect(screen.getByTestId("edition-save-button")).toBeInTheDocument();
    });
});
