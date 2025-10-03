import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentItems from "./MultiContentItems";

describe("MultiContentItems", () => {
    it("renders correctly when type=input", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="input" buttonLabel="Add new test item"/>);
        const input = screen.getByTestId("multi-content-test-input-0");
        expect(input).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-0");
        expect(textarea).toBeInTheDocument();

        const button = screen.getByTestId("multi-content-test-add-button");
        expect(button).toBeInTheDocument();
    });

    it("renders correctly when type=select", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="select" buttonLabel="Add new test item"/>);
        const select = screen.getByTestId("select-multi-content-test-select-0");
        expect(select).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-0");
        expect(textarea).toBeInTheDocument();

        const button = screen.getByTestId("multi-content-test-add-button");
        expect(button).toBeInTheDocument();
    });

    it("clicking button adds new item", () => {
        render(<MultiContentItems id="multi-content-test" fieldType="input" buttonLabel="Add new test item"/>);
        const button = screen.getByTestId("multi-content-test-add-button");


        expect(screen.queryByTestId("multi-content-test-input-1")).not.toBeInTheDocument();

        fireEvent.click(button);
        expect(screen.getByTestId("multi-content-test-input-1")).toBeInTheDocument();
    });
});