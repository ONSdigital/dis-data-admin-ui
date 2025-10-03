import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsSelect from "./MultiContentFieldsSelect";

describe("MultiContentItemsSelect", () => {
    it("renders correctly when type=input", () => {
        render(<MultiContentFieldsSelect id="multi-content-test" index={1}/>);
        const select = screen.getByTestId("multi-content-test-select-1");
        expect(select).toBeInTheDocument();

        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        expect(textarea).toBeInTheDocument();

    });

    it("onChange handler updates select state", () => {
        render(<MultiContentFieldsSelect id="multi-content-test" index={1}/>);
        const select = screen.getByTestId("select-multi-content-test-select-1");
        const selectValue = screen.getByTestId("multi-content-test");
        fireEvent.change(select, {target: {value: "alert"}});
        expect(JSON.parse(selectValue.value).type).toBe("alert");
    });

    it("onChange handler updates text area state", () => {
        render(<MultiContentFieldsSelect id="multi-content-test" index={1}/>);
        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        fireEvent.change(textarea, {target: {value: "test value"}});
        expect(textarea.value).toBe("test value");
    });
});