import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsRadios from "./MultiContentFieldsRadios";

let onChangeHandler;
beforeEach(() => {
    onChangeHandler = jest.fn();
});

describe("MultiContentItemsSelect", () => {
    it("renders correctly when type=input", () => {
        render(<MultiContentFieldsRadios id="multi-content-test" index={1} onChange={onChangeHandler}/>);
        const select = screen.getByTestId("multi-content-test-select-1");
        expect(select).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        expect(textarea).toBeInTheDocument();
    });

    it("onChange handler updates select state", () => {
        render(<MultiContentFieldsRadios id="multi-content-test" index={1} onChange={onChangeHandler}/>);
        expect(onChangeHandler.mock.calls).toHaveLength(0);
        const select = screen.getByTestId("select-multi-content-test-select-1");
        const selectValue = screen.getByTestId("multi-content-test");
        fireEvent.change(select, {target: {value: "alert"}});
        expect(JSON.parse(selectValue.value).type).toBe("alert");
        expect(onChangeHandler.mock.calls).toHaveLength(1);
    });

    it("onChange handler updates text area state", () => {
        render(<MultiContentFieldsRadios id="multi-content-test" index={1} onChange={onChangeHandler}/>);
        expect(onChangeHandler.mock.calls).toHaveLength(0);
        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        fireEvent.change(textarea, {target: {value: "test value"}});
        expect(textarea.value).toBe("test value");
        expect(onChangeHandler.mock.calls).toHaveLength(1);
    });
});