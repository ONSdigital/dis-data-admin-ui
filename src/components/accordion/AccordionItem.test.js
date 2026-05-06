import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import AccordionItem from "./AccordionItem";
import styles from "./AccordionItem.module.css";

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
        const { container } = render(
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
        const iconContainer = container.querySelector(".ons-details__icon");
        expect(iconContainer).toHaveClass(styles.iconOpen);
    });

    test("adds open icon class when expanded", async () => {
        const { container } = render(
            <AccordionItem
                accordionItem={{
                    id: "Item Three",
                    label: "Class toggle label",
                    body: <p>Accordion body</p>,
                }}
            />
        );

        const iconContainer = container.querySelector(".ons-details__icon");
        expect(iconContainer).toBeInTheDocument();
        expect(iconContainer).not.toHaveClass(styles.iconOpen);

        await userEvent.click(screen.getByRole("button"));
        expect(iconContainer).toHaveClass(styles.iconOpen);
    });
});
