import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MultiContentFieldsRelatedContent from "./MultiContentFieldsRelatedContent";

const item = {
    title: "Methodology",
    href: "https://example.com/methodology",
    description: "Read the methodology for this release",
};

const renderRelatedContent = (props = {}) => {
    const handleOnChange = props.handleOnChange || jest.fn();
    const handleOnRemove = props.handleOnRemove || jest.fn();
    const view = render(
        <MultiContentFieldsRelatedContent
            id="related-content"
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

describe("MultiContentFieldsRelatedContent", () => {
    describe("renders", () => {
        it("with the related content values", () => {
            renderRelatedContent();

            expect(screen.getByTestId("related-content-title-0")).toHaveValue("Methodology");
            expect(screen.getByTestId("related-content-url-0")).toHaveValue("https://example.com/methodology");
            expect(screen.getByTestId("related-content-description-0")).toHaveValue("Read the methodology for this release");
            expect(document.getElementById("related-content")).toHaveValue(JSON.stringify({
                title: item.title,
                href: item.href,
                description: item.description,
            }));
            expect(screen.queryByText("Remove related content")).not.toBeInTheDocument();
            expect(screen.queryByText("Related content title is required")).not.toBeInTheDocument();
        });

        it("with validation errors on the title and URL", () => {
            renderRelatedContent({
                errors: {
                    "related-content-title-0": ["Related content title is required"],
                    "related-content-url-0": ["Related content URL is required"],
                },
            });

            expect(screen.getByText("Related content title is required")).toBeInTheDocument();
            expect(document.getElementById("related-content-title-0-error")).toBeInTheDocument();
            expect(screen.getByText("Related content URL is required")).toBeInTheDocument();
            expect(document.getElementById("related-content-url-0-error")).toBeInTheDocument();
        });
    });

    it("calls handleOnChange with the updated related content", () => {
        const { handleOnChange, rerender } = renderRelatedContent();

        fireEvent.change(screen.getByTestId("related-content-title-0"), { target: { value: "Quality information" } });
        expect(screen.getByTestId("related-content-title-0")).toHaveValue("Methodology");
        expect(handleOnChange).toHaveBeenCalledWith({ ...item, title: "Quality information" });

        const updatedItem = { ...item, title: "Quality information" };
        rerender(
            <MultiContentFieldsRelatedContent
                id="related-content"
                index={0}
                item={updatedItem}
                handleOnChange={handleOnChange}
                handleOnRemove={jest.fn()}
            />
        );
        expect(screen.getByTestId("related-content-title-0")).toHaveValue("Quality information");
        expect(document.getElementById("related-content")).toHaveValue(JSON.stringify({
            title: updatedItem.title,
            href: updatedItem.href,
            description: updatedItem.description,
        }));

        fireEvent.change(screen.getByTestId("related-content-url-0"), { target: { value: "https://example.com/quality" } });
        expect(handleOnChange).toHaveBeenCalledWith({ ...updatedItem, href: "https://example.com/quality" });

        fireEvent.change(screen.getByTestId("related-content-description-0"), { target: { value: "Information about quality" } });
        expect(handleOnChange).toHaveBeenCalledWith({ ...updatedItem, description: "Information about quality" });
    });

    it("calls handleOnRemove when the remove link is clicked", () => {
        const handleOnRemove = jest.fn();
        renderRelatedContent({ showRemoveButton: true, handleOnRemove });

        fireEvent.click(screen.getByText("Remove related content"));
        expect(handleOnRemove).toHaveBeenCalledTimes(1);
    });
});
