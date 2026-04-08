import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AccordionItem from "./AccordionItem";

describe("AccordionItem", () => {
    test("renders closed by default and toggles content open and closed", async () => {
        render(
            <AccordionItem
                accordionItem={{
                    id: "Item One",
                    label: "Accordion label",
                    body: <p>Accordion body</p>,
                }}
            />
        );

        expect(screen.getByTestId("accordion-item-item-one")).toBeInTheDocument();
        expect(screen.getByText("Accordion label")).toBeInTheDocument();
        expect(screen.queryByTestId("accordion-item-item-one-content")).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole("button"));
        expect(screen.getByTestId("accordion-item-item-one-content")).toBeInTheDocument();
        expect(screen.getByTestId("accordion-item-item-one-content")).toHaveTextContent("Accordion body");

        await userEvent.click(screen.getByRole("button"));
        expect(screen.queryByTestId("accordion-item-item-one-content")).not.toBeInTheDocument();
    });

    test("renders open initially and shows fallback content when body is missing", () => {
        render(
            <AccordionItem
                accordionItem={{
                    id: "Item Two",
                    label: "Fallback label",
                    isOpen: true,
                }}
            />
        );

        expect(screen.getByTestId("accordion-item-item-two-content")).toBeInTheDocument();
        expect(screen.getByTestId("accordion-item-item-two-content")).toHaveTextContent("No contents to show");
    });
});
