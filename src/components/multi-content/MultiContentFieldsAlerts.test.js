import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsAlerts from "./MultiContentFieldsAlerts";

const item = { type: "correction", note: "Saved correction" };

const renderAlert = (props = {}) => {
    const handleOnChange = props.handleOnChange || jest.fn();
    const handleOnRemove = props.handleOnRemove || jest.fn();
    const view = render(
        <MultiContentFieldsAlerts
            id="alerts"
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

describe("MultiContentFieldsAlerts", () => {
    describe("renders", () => {
        it("with the saved alert type and description", () => {
            renderAlert();

            expect(screen.getByTestId("alerts-radios-0-item-alerts-radios-0-correction-input")).toBeChecked();
            expect(screen.getByTestId("alerts-radios-0-item-alerts-radios-0-notice-input")).not.toBeChecked();
            expect(screen.getByTestId("alerts-textarea-0")).toHaveValue("Saved correction");
            expect(screen.getByTestId("alerts")).toHaveValue(JSON.stringify({ type: "correction", description: "Saved correction" }));
            expect(screen.queryByText("Remove usage note")).not.toBeInTheDocument();
            expect(screen.queryByText("Alert type is required")).not.toBeInTheDocument();
        });

        it("with validation errors on the type and description", () => {
            renderAlert({
                errors: {
                    "alerts-radios-0": ["Alert type is required"],
                    "alerts-textarea-0": ["Alert note is required"],
                },
            });

            expect(screen.getByText("Alert type is required")).toBeInTheDocument();
            expect(screen.getByText("Alert note is required")).toBeInTheDocument();
            expect(document.getElementById("alerts-textarea-0-error")).toBeInTheDocument();
        });
    });

    it("calls handleOnChange with the updated alert", () => {
        const { handleOnChange, rerender } = renderAlert();

        fireEvent.click(screen.getByTestId("alerts-radios-0-item-alerts-radios-0-notice-input"));
        expect(handleOnChange).toHaveBeenCalledWith({ type: "alert", note: "Saved correction" });

        const updatedItem = { type: "alert", note: "Saved correction" };
        rerender(
            <MultiContentFieldsAlerts
                id="alerts"
                index={0}
                item={updatedItem}
                handleOnChange={handleOnChange}
                handleOnRemove={jest.fn()}
            />
        );
        expect(screen.getByTestId("alerts-radios-0-item-alerts-radios-0-notice-input")).toBeChecked();
        expect(screen.getByTestId("alerts")).toHaveValue(JSON.stringify({ type: "alert", description: "Saved correction" }));

        fireEvent.change(screen.getByTestId("alerts-textarea-0"), { target: { value: "Updated description" } });
        expect(handleOnChange).toHaveBeenCalledWith({ type: "alert", note: "Updated description" });
    });

    it("calls handleOnRemove when the remove link is clicked", () => {
        const handleOnRemove = jest.fn();
        renderAlert({ showRemoveButton: true, handleOnRemove });

        fireEvent.click(screen.getByText("Remove alert"));
        expect(handleOnRemove).toHaveBeenCalledTimes(1);
    });
});
