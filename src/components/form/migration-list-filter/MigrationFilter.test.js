import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MigrationFilter from "./MigrationFilter";

import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
}));

describe("MigrationFilter", () => {
    let router;

    const listOfStates = ["approved", "submitted", "in_review", "rejected"];

    beforeEach(() => {
        router = useRouter();
        router.push.mockClear();
    });

    describe("renders correctly", () => {
        it("renders the checkbox list and apply button", () => {
            render(<MigrationFilter states={listOfStates} selectedStates={[]} pathname="/migration" />);

            expect(screen.getByTestId("fieldset-state-filter")).toBeInTheDocument();

            expect(screen.getByTestId("state-filter-item-approved-input")).toBeInTheDocument();
            expect(screen.getByTestId("state-filter-item-submitted-input")).toBeInTheDocument();
            expect(screen.getByTestId("state-filter-item-in-review-input")).toBeInTheDocument();
            expect(screen.getByTestId("state-filter-item-rejected-input")).toBeInTheDocument();

            expect(screen.getByTestId("migration-filter-apply-button")).toBeInTheDocument();
        });
    });

    describe("onClick handler", () => {
        it("is called with single selected state", () => {
            render(<MigrationFilter states={listOfStates} selectedStates={[]} pathname="/migration" />);

            fireEvent.click(screen.getByTestId("state-filter-item-approved-input"));
            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledWith("/migration?state=approved");
        });

        it("is called with multiple selected states", () => {
            render(<MigrationFilter states={listOfStates} selectedStates={[]} pathname="/migration" />);

            fireEvent.click(screen.getByTestId("state-filter-item-approved-input"));
            fireEvent.click(screen.getByTestId("state-filter-item-submitted-input"));
            fireEvent.click(screen.getByTestId("state-filter-item-in-review-input"));

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledWith("/migration?state=approved,submitted,in_review");
        });

        it("removes a state when checkbox is unchecked", () => {
            render(<MigrationFilter states={listOfStates} selectedStates={[]} pathname="/migration" />);

            const approved = screen.getByTestId("state-filter-item-approved-input");
            const submitted = screen.getByTestId("state-filter-item-submitted-input");

            fireEvent.click(approved);
            fireEvent.click(submitted);

            // Uncheck approved
            fireEvent.click(approved);

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledWith("/migration?state=submitted");
        });
    });
});
