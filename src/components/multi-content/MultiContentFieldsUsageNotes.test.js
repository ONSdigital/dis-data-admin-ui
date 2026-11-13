import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsUsageNotes from "./MultiContentFieldsUsageNotes";

const item = { title: "Usage note title", note: "A note about this dataset" };

const renderUsageNote = (props = {}) => {
    const handleOnChange = props.handleOnChange || jest.fn();
    const handleOnRemove = props.handleOnRemove || jest.fn();
    const view = render(
        <MultiContentFieldsUsageNotes
            id="usage-notes"
            index={0}
            item={item}
            handleOnChange={handleOnChange}
            handleOnRemove={handleOnRemove}
            showRemoveButton={false}
            {...props}
        />
    );
    return { ...view, handleOnChange, handleOnRemove };
};

describe("MultiContentFieldsUsageNotes", () => {
    describe("renders", () => {
        it("with the usage note values", () => {
            renderUsageNote();

            expect(screen.getByTestId("usage-notes-input-0")).toHaveValue("Usage note title");
            expect(screen.getByTestId("usage-notes-textarea-0")).toHaveValue("A note about this dataset");
            expect(document.getElementById("usage-notes")).toHaveValue(JSON.stringify(item));
            expect(screen.getByText("Clear usage note")).toBeInTheDocument();
            expect(screen.queryByText("Remove usage note")).not.toBeInTheDocument();
            expect(screen.queryByText("Usage note title is required")).not.toBeInTheDocument();
        });

        it("with validation errors on the title and description", () => {
            renderUsageNote({
                errors: {
                    "usage-notes-input-0": ["Usage note title is required"],
                    "usage-notes-textarea-0": ["Usage note is required"],
                },
            });

            expect(screen.getByText("Usage note title is required")).toBeInTheDocument();
            expect(document.getElementById("usage-notes-input-0-error")).toBeInTheDocument();
            expect(screen.getByText("Usage note is required")).toBeInTheDocument();
            expect(document.getElementById("usage-notes-textarea-0-error")).toBeInTheDocument();
        });
    });

    it("calls handleOnChange with the updated usage note", () => {
        const { handleOnChange, rerender } = renderUsageNote();

        fireEvent.change(screen.getByTestId("usage-notes-input-0"), { target: { value: "New title" } });
        expect(screen.getByTestId("usage-notes-input-0")).toHaveValue("Usage note title");
        expect(handleOnChange).toHaveBeenCalledWith({ title: "New title", note: "A note about this dataset" });

        const updatedItem = { title: "New title", note: "A note about this dataset" };
        rerender(
            <MultiContentFieldsUsageNotes
                id="usage-notes"
                index={0}
                item={updatedItem}
                handleOnChange={handleOnChange}
                handleOnRemove={jest.fn()}
            />
        );
        expect(screen.getByTestId("usage-notes-input-0")).toHaveValue("New title");
        expect(document.getElementById("usage-notes")).toHaveValue(JSON.stringify(updatedItem));

        fireEvent.change(screen.getByTestId("usage-notes-textarea-0"), { target: { value: "New note" } });
        expect(handleOnChange).toHaveBeenCalledWith({ title: "New title", note: "New note" });
    });

    it("calls handleOnChange when the clear link is clicked", () => {
        const handleOnChange = jest.fn();
        const handleOnRemove = jest.fn();
        renderUsageNote({ handleOnChange, handleOnRemove });

        fireEvent.click(screen.getByText("Clear usage note"));
        expect(handleOnChange).toHaveBeenCalledWith({ index: 0, title: "", note: "" });
        expect(handleOnRemove).not.toHaveBeenCalled();
    });

    it("calls handleOnRemove when the remove link is clicked", () => {
        const handleOnChange = jest.fn();
        const handleOnRemove = jest.fn();
        renderUsageNote({ showRemoveButton: true, handleOnChange, handleOnRemove });

        fireEvent.click(screen.getByText("Remove usage note"));
        expect(handleOnRemove).toHaveBeenCalledTimes(1);
        expect(handleOnChange).not.toHaveBeenCalled();
    });
});
