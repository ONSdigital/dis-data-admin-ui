import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsInput from "./MultiContentFieldsInput";

let onChangeHandler;
beforeEach(() => {
    onChangeHandler = jest.fn();
});

describe("MultiContentItemsInput", () => {
    it("renders correctly when type=input", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1} onChange={onChangeHandler}/>);
        const input = screen.getByTestId("multi-content-test-input-1");
        expect(input).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        expect(textarea).toBeInTheDocument();

    });

    it("onChange handler updates input state", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1} onChange={onChangeHandler}/>);
        expect(onChangeHandler.mock.calls).toHaveLength(0);
        const input = screen.getByTestId("multi-content-test-input-1");
        fireEvent.change(input, {target: {value: "test value"}});
        expect(input.value).toBe("test value");
        expect(onChangeHandler.mock.calls).toHaveLength(1);
    });

    it("onChange handler updates text area state", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1} onChange={onChangeHandler}/>);
        expect(onChangeHandler.mock.calls).toHaveLength(0);
        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        fireEvent.change(textarea, {target: {value: "test value"}});
        expect(textarea.value).toBe("test value");
        expect(onChangeHandler.mock.calls).toHaveLength(1);
    });
});