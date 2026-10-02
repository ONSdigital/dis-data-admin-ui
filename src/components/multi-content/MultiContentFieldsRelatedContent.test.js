import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsRelatedContent from "./MultiContentFieldsRelatedContent";

let onFieldsHaveContentHandler;
beforeEach(() => {
    onFieldsHaveContentHandler = jest.fn();
});

describe("MultiContentFieldsRelatedContent", () => {
    describe("renders correctly", () => {
        it("when field data is not provided", () => {
            render(<MultiContentFieldsRelatedContent id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler}/>);

            expect(screen.getByTestId("multi-content-test-title-1")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-url-1")).toBeInTheDocument();
            expect(screen.getByTestId("multi-content-test-description-1")).toBeInTheDocument();
        });

        it("when field data is provided", () => {
            const fieldData = {
                title: "Methodology",
                href: "https://example.com/methodology",
                description: "Read the methodology for this release"
            };
            render(<MultiContentFieldsRelatedContent id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler} field={fieldData}/>);

            expect(screen.getByDisplayValue("Methodology")).toBeInTheDocument();
            expect(screen.getByDisplayValue("https://example.com/methodology")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Read the methodology for this release")).toBeInTheDocument();
        });
    });

    it("onFieldsHaveContent handler returns the correct value", () => {
        render(<MultiContentFieldsRelatedContent id="multi-content-test" index={1} onFieldsHaveContent={onFieldsHaveContentHandler}/>);
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(1);
        expect(onFieldsHaveContentHandler.mock.calls[0][0]).toBeFalsy();

        const titleInput = screen.getByTestId("multi-content-test-title-1");
        fireEvent.change(titleInput, {target: {value: "Quality Information"}});
        expect(titleInput.value).toBe("Quality Information");
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(1);
        expect(onFieldsHaveContentHandler.mock.calls[0][0]).toBeFalsy();

        const urlInput = screen.getByTestId("multi-content-test-url-1");
        fireEvent.change(urlInput, {target: {value: "https://example.com/quality"}});
        expect(urlInput.value).toBe("https://example.com/quality");
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(2);
        expect(onFieldsHaveContentHandler.mock.calls[1][0]).toBeTruthy();

        const descriptionTextarea = screen.getByTestId("multi-content-test-description-1");
        fireEvent.change(descriptionTextarea, {target: {value: "Information about quality"}});
        expect(descriptionTextarea.value).toBe("Information about quality");
        expect(onFieldsHaveContentHandler.mock.calls).toHaveLength(2);
        expect(onFieldsHaveContentHandler.mock.calls[1][0]).toBeTruthy();
    });
});
