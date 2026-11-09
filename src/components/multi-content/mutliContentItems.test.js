import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentItems from "./MultiContentItems";

describe("MultiContentItems", () => {
    describe("renders correctly when type=usage-notes", () => {
        it("and doesn't contain data e.g. 'create' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="usage-notes" buttonLabel="Add new test item"/>);
            expect(screen.getByTestId("multi-content-test-input-0")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-textarea-0")).toBeInTheDocument();

            const button = screen.getByTestId("multi-content-test-add-button");
            expect(button).toBeInTheDocument();
            expect(button).toHaveTextContent("Add new test item");
        });

        it("and does contain data e.g. 'edit' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="usage-notes" buttonLabel="Add new test item" contentItems={[{ title: "Note title", note: "Note body" }]}/>);
            expect(screen.getByTestId("multi-content-test-input-0")).toHaveValue("Note title");
            expect(screen.getByTestId("multi-content-test-textarea-0")).toHaveValue("Note body");
        });
    });

    describe("renders correctly when type=alerts", () => {
        it("and doesn't contain data e.g. 'create' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="alerts" buttonLabel="Add new test item"/>);
            expect(screen.queryByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-correction-input")).toBeInTheDocument();
            expect(screen.queryByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-notice-input")).toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-textarea-0")).toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-add-button")).toBeInTheDocument();
        });

        it("and does contain data e.g. 'edit' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="alerts" buttonLabel="Add new test item" contentItems={[{type: "alert", description: "test"}]}/>);
            expect(screen.getByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-correction-input")).not.toBeChecked();
            expect(screen.getByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-notice-input")).toBeChecked();

            expect(screen.getByTestId("multi-content-test-textarea-0")).toHaveValue("test");

            const button = screen.getByTestId("multi-content-test-add-button");
            expect(button).toBeInTheDocument();
        });
    });

    describe("renders correctly when type=related-content", () => {
        it("and doesn't contain data e.g. 'create' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="related-content" buttonLabel="Add new related content"/>);
            expect(screen.getByTestId("multi-content-test-title-0")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-url-0")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-description-0")).toBeInTheDocument();

            const button = screen.getByTestId("multi-content-test-add-button");
            expect(button).toBeInTheDocument();
        });

        it("and does contain data e.g. 'edit' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="related-content" buttonLabel="Add new related content" contentItems={[{title: "Methodology", href: "https://example.com", description: "Read the methodology"}]}/>);
            expect(screen.getByTestId("multi-content-test-title-0")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Methodology")).toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-url-0")).toBeInTheDocument();
            expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-description-0")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Read the methodology")).toBeInTheDocument();

            const button = screen.getByTestId("multi-content-test-add-button");
            expect(button).toBeInTheDocument();
        });
    });

    it("renders one blank row when contentItems is empty", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="usage-notes" buttonLabel="Add new test item" contentItems={[]}/>);

        expect(screen.getByTestId("multi-content-test-input-0")).toHaveValue("");
        expect(screen.getByTestId("multi-content-test-textarea-0")).toHaveValue("");
        expect(screen.queryByTestId("multi-content-test-input-1")).not.toBeInTheDocument();
    });

    it("stores an edited usage note on that row", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="usage-notes" buttonLabel="Add new test item"/>);

        fireEvent.change(screen.getByTestId("multi-content-test-input-0"), { target: { value: "New title" } });

        expect(screen.getByTestId("multi-content-test-input-0")).toHaveValue("New title");
        expect(document.getElementById("multi-content-test")).toHaveValue(JSON.stringify({ title: "New title", note: "" }));
    });

    it("clicking button adds a blank item and keeps the first row", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="usage-notes" buttonLabel="Add new test item"/>);
        fireEvent.change(screen.getByTestId("multi-content-test-input-0"), { target: { value: "Kept title" } });
        fireEvent.change(screen.getByTestId("multi-content-test-textarea-0"), { target: { value: "Kept note" } });
        expect(screen.queryByTestId("multi-content-test-input-1")).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId("multi-content-test-add-button"));

        expect(screen.getByTestId("multi-content-test-input-0")).toHaveValue("Kept title");
        expect(screen.getByTestId("multi-content-test-textarea-0")).toHaveValue("Kept note");
        expect(screen.getByTestId("multi-content-test-input-1")).toHaveValue("");
        expect(screen.getByTestId("multi-content-test-textarea-1")).toHaveValue("");
    });

    it("removes the row that was clicked", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="usage-notes" buttonLabel="Add new test item"/>);
        expect(screen.queryByText("Remove usage note")).not.toBeInTheDocument();

        fireEvent.change(screen.getByTestId("multi-content-test-input-0"), { target: { value: "First title" } });
        fireEvent.click(screen.getByTestId("multi-content-test-add-button"));
        fireEvent.change(screen.getByTestId("multi-content-test-input-1"), { target: { value: "Second title" } });

        const removeLinks = screen.getAllByText("Remove usage note");
        expect(removeLinks).toHaveLength(2);
        fireEvent.click(removeLinks[0]);

        expect(screen.getByTestId("multi-content-test-input-0")).toHaveValue("Second title");
        expect(screen.queryByTestId("multi-content-test-input-1")).not.toBeInTheDocument();
        expect(screen.queryByText("Remove usage note")).not.toBeInTheDocument();
    });

    describe("passes errors to the matching row", () => {
        const twoUsageNotes = [{ title: "First", note: "One" }, { title: "Second", note: "Two" }];
        const twoAlerts = [{ type: "correction", note: "First alert" }, { type: "", note: "Second alert" }];
        const twoRelatedContent = [
            { title: "First", href: "https://example.com/first", description: "First description" },
            { title: "Second", href: "", description: "Second description" },
        ];

        it("for a usage note description", () => {
            render(
                <MultiContentItems
                    id="multi-content-test"
                    fieldType="usage-notes"
                    buttonLabel="Add new test item"
                    contentItems={twoUsageNotes}
                    errors={{ "multi-content-test-textarea-1": ["Usage note is required"] }}
                />
            );

            expect(screen.getByText("Usage note is required")).toBeInTheDocument();
            expect(document.getElementById("multi-content-test-textarea-1-error")).toBeInTheDocument();
            expect(document.getElementById("multi-content-test-textarea-0-error")).not.toBeInTheDocument();
        });

        it("for an alert type", () => {
            render(
                <MultiContentItems
                    id="multi-content-test"
                    fieldType="alerts"
                    buttonLabel="Add new test item"
                    contentItems={twoAlerts}
                    errors={{ "multi-content-test-radios-1": ["Alert type is required"] }}
                />
            );

            expect(screen.getByText("Alert type is required")).toBeInTheDocument();
            expect(screen.getAllByText("Alert type is required")).toHaveLength(1);
        });

        it("for a related content URL", () => {
            render(
                <MultiContentItems
                    id="multi-content-test"
                    fieldType="related-content"
                    buttonLabel="Add new related content"
                    contentItems={twoRelatedContent}
                    errors={{ "multi-content-test-url-1": ["Related content URL is required"] }}
                />
            );

            expect(screen.getByText("Related content URL is required")).toBeInTheDocument();
            expect(document.getElementById("multi-content-test-url-1-error")).toBeInTheDocument();
            expect(document.getElementById("multi-content-test-url-0-error")).not.toBeInTheDocument();
        });
    });
});
