import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsRadios from "./MultiContentFieldsRadios";

let onFieldsHaveContentHandler;
beforeEach(() => {
    onFieldsHaveContentHandler = jest.fn();
});

describe("MultiContentItemsSelect", () => {
    describe("renders correctly", () => {
        it("when show showTypeOptions is false", () => {
            render(<MultiContentFieldsRadios id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler} showTypeOptions={false}/>);

            expect(screen.queryByTestId("multi-content-test-radios-1-item-multi-content-test-radios-1-correction-input")).not.toBeInTheDocument();
            expect(screen.queryByTestId("multi-content-test-radios-1-item-multi-content-test-radios-1-notice-input")).not.toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-textarea-1")).toBeInTheDocument();
        });
        it("when show showTypeOptions is true", () => {
            render(<MultiContentFieldsRadios id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler} showTypeOptions={true}/>);

            expect(screen.getByTestId("multi-content-test-radios-1-item-multi-content-test-radios-1-correction-input")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-radios-1-item-multi-content-test-radios-1-notice-input")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-textarea-1")).toBeInTheDocument();
        });
    });

    it("onFieldsHaveContent handler returns the correct value", () => {
        render(<MultiContentFieldsRadios id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler} showTypeOptions={true}/>);
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(1);
        expect(onFieldsHaveContentHandler.mock.calls[0][0]).toBeFalsy();

        const radio = screen.getByTestId("multi-content-test-radios-1-item-multi-content-test-radios-1-correction-input");
        fireEvent.click(radio);
        expect(radio.value).toBe("correction");
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