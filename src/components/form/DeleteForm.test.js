import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import DeleteForm from "./DeleteForm";

describe("Delete Form", () => {
    const mockAction = jest.fn()

    const mockDatasetID = "Mock Dataset"
    const mockEditionID = "Mock Edition"
    const mockVersionID = "1"
    const mockResource = "Mock Resource"

    test("renders correctly", () => {
        render(<DeleteForm datasetID={mockDatasetID} editionID={mockEditionID} versionID={mockVersionID} resource={mockResource} action={mockAction}/>);

        expect(screen.getByDisplayValue(mockDatasetID)).toHaveAttribute("type", "hidden");
        expect(screen.getByDisplayValue(mockEditionID)).toHaveAttribute("type", "hidden");
        expect(screen.getByDisplayValue(mockVersionID)).toHaveAttribute("type", "hidden");
        expect(screen.getByDisplayValue(mockResource)).toHaveAttribute("type", "hidden");

        expect(screen.queryByTestId("delete-error")).not.toBeInTheDocument();

        const checkbox = screen.getByTestId("fieldset-confirm-delete");
        expect(checkbox).toBeInTheDocument();

        const checkboxLegend = screen.getByTestId("fieldset-confirm-delete-legend");
        expect(checkboxLegend).toHaveTextContent(`Are you sure you want to delete this item? (${mockResource})`);

        const checkboxInput = screen.getByTestId("confirm-delete-item-yes-input");
        expect(checkboxInput).not.toBeChecked();

        const deleteButton = screen.getByRole("button");
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveTextContent("Delete");
    });

    test("shows confirm checkbox error when present", () => {
        mockAction.mockReturnValue({ errors: { "confirm-delete": ["You must confirm deletion."] } });

        render(<DeleteForm datasetID={mockDatasetID} editionID={mockEditionID} versionID={mockVersionID} resource={mockResource} action={mockAction}/>);

        const deleteButton = screen.getByRole("button");
        fireEvent.click(deleteButton);

        const checkboxError = screen.getByTestId("fieldset-confirm-delete-error");
        expect(checkboxError).toBeInTheDocument();
        expect(checkboxError).toHaveTextContent("You must confirm deletion.");
    });

    test("shows API error panel when request fails", () => {
        mockAction.mockReturnValue({ errors: { api : "Failed to delete." } });

        render(<DeleteForm datasetID={mockDatasetID} editionID={mockEditionID} versionID={mockVersionID} resource={mockResource} action={mockAction}/>);

        const checkboxInput = screen.getByTestId("confirm-delete-item-yes-input");
        fireEvent.click(checkboxInput);
        expect(checkboxInput).toBeChecked();

        const deleteButton = screen.getByRole("button");
        fireEvent.click(deleteButton);

        const errorPanel = screen.getByTestId("delete-error");
        expect(errorPanel).toBeInTheDocument();
        expect(errorPanel).toHaveTextContent("There was a problem deleting");
        expect(errorPanel).toHaveTextContent("An error occurred while trying to delete.");

        expect(checkboxInput).not.toBeChecked();
    });
})