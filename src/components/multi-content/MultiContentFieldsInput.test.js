import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsInput from "./MultiContentFieldsInput";

let onFieldsHaveContentHandler;
beforeEach(() => {
    onFieldsHaveContentHandler = jest.fn();
});

describe("MultiContentItemsInput", () => {
    it("renders correctly", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler}/>);
        
        expect(screen.getByTestId("multi-content-test-input-1")).toBeInTheDocument();
        expect(screen.getByTestId("multi-content-test-textarea-1")).toBeInTheDocument();
    });

    it("onFieldsHaveContent handler returns the correct value", () => {
        render(<MultiContentFieldsInput id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler}/>);
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(1);
        expect(onFieldsHaveContentHandler.mock.calls[0][0]).toBeFalsy();

        const input = screen.getByTestId("multi-content-test-input-1");
        fireEvent.change(input, {target: {value: "test value"}});
        expect(input.value).toBe("test value");
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(1);
        console.log(onFieldsHaveContentHandler.mock.calls[0])
        expect(onFieldsHaveContentHandler.mock.calls[0][0]).toBeFalsy();

        const textarea = screen.getByTestId("multi-content-test-textarea-1");
        fireEvent.change(textarea, {target: {value: "test value"}});
        expect(textarea.value).toBe("test value");
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(2);
        expect(onFieldsHaveContentHandler.mock.calls[1][0]).toBeTruthy();
    });

});