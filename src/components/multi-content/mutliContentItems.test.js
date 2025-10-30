import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentItems from "./MultiContentItems";
import { expect } from "@playwright/test";

describe("MultiContentItems", () => {
    it("renders correctly when type=input", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="input" buttonLabel="Add new test item"/>);
        const input = screen.getByTestId("multi-content-test-input-0");
        expect(input).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-0");
        expect(textarea).toBeInTheDocument();

        const button = screen.getByTestId("multi-content-test-add-button");
        expect(button).toBeInTheDocument();
        expect(button.disabled).toBeTruthy();
    });

    describe("renders correctly when type=radios", () => {
        it("and doesn't contain data e.g. 'create' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="radios" buttonLabel="Add new test item"/>);
            expect(screen.queryByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-correction-input")).not.toBeInTheDocument();
            expect(screen.queryByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-notice-input")).not.toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-textarea-0")).toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-add-button")).toBeInTheDocument();
        });

        it("and does contain data e.g. 'edit' mode", () => {
            render(<MultiContentItems id="multi-content-test" fieldType="radios" buttonLabel="Add new test item" contentItems={[{type: "alert", note: "test"}]}/>);
            expect(screen.getByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-correction-input")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-radios-0-item-multi-content-test-radios-0-notice-input")).toBeInTheDocument();

            expect(screen.getByTestId("multi-content-test-textarea-0")).toBeInTheDocument();

            const button = screen.getByTestId("multi-content-test-add-button");
            expect(button).toBeInTheDocument();
        });
    });

    it("clicking button adds new item", async () => {
        render(<MultiContentItems id="multi-content-test" fieldType="input" buttonLabel="Add new test item"/>);
        const button = screen.getByTestId("multi-content-test-add-button");
        expect(button.disabled).toBeTruthy();

        const input = screen.getByTestId("multi-content-test-input-0");
        fireEvent.change(input, {target: {value: "test value"}});

        expect(button.disabled).toBeTruthy();

        const textarea = screen.getByTestId("multi-content-test-textarea-0");
        fireEvent.change(textarea, {target: {value: "test value"}});

        expect(button.disabled).toBeFalsy();
        expect(screen.queryByTestId("multi-content-test-input-1")).not.toBeInTheDocument();

        fireEvent.click(button);
        expect(screen.getByTestId("multi-content-test-input-1")).toBeInTheDocument();
    });
});