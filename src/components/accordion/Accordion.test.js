import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Accordion from "./Accordion";

jest.mock("./AccordionItem", () => ({
    __esModule: true,
    default: ({ accordionItem }) => <div data-testid={`mock-accordion-item-${accordionItem.id}`}>{accordionItem.label}</div>,
}));

describe("Accordion", () => {
    const accordionItems = [
        { id: "one", label: "First item" },
        { id: "two", label: "Second item" },
    ];

    test("renders as expected", () => {
        render(<Accordion id="Accordion Example" dataTestId="Accordion" accordionItems={accordionItems} />);

        expect(screen.getByTestId("accordion")).toBeInTheDocument();
        expect(screen.getByTestId("accordion")).toHaveAttribute("id", "accordion-example");
        expect(screen.getByTestId("mock-accordion-item-one")).toHaveTextContent("First item");
        expect(screen.getByTestId("mock-accordion-item-two")).toHaveTextContent("Second item");
    });

    test("renders nothing when accordion items are missing", () => {
        const { container } = render(<Accordion id="Accordion Example" dataTestId="Accordion Wrapper" />);

        expect(container.firstChild).toBeNull();
    });
});
