import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MigrationFilter from "./MigrationFilter";

import { useRouter, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}));

describe("MigrationFilter", () => {
    let router;

    const listOfStates = [
        { id: "approved", label: "Approved", count: 4 },
        { id: "submitted", label: "Submitted", count: 2 },
        { id: "in_review", label: "In review", count: 1 },
        { id: "rejected", label: "Rejected", count: 0 },
    ];

    beforeEach(() => {
        useRouter.mockReturnValue({
            push: jest.fn(),
        });
        usePathname.mockReturnValue("/migration");

        router = useRouter();
        router.push.mockClear();
    });

    describe("renders correctly", () => {
        it("renders the checkbox list and apply button", () => {
            render(<MigrationFilter states={listOfStates} />);

            expect(screen.getByTestId("fieldset-state-filter")).toBeInTheDocument();
            expect(screen.getByLabelText("Approved (4)")).toBeInTheDocument();
            expect(screen.getByLabelText("Submitted (2)")).toBeInTheDocument();
            expect(screen.getByLabelText("In review (1)")).toBeInTheDocument();
            expect(screen.queryByLabelText("Rejected (0)")).not.toBeInTheDocument();

            expect(screen.getByTestId("migration-filter-apply-button")).toBeInTheDocument();
        });

        it("renders selected states from props", () => {
            render(<MigrationFilter states={listOfStates} selectedStates={["approved", "submitted"]} />);

            expect(screen.getByLabelText("Approved (4)")).toBeChecked();
            expect(screen.getByLabelText("Submitted (2)")).toBeChecked();
            expect(screen.getByLabelText("In review (1)")).not.toBeChecked();
        });

        it("renders the label from props", () => {
            render(<MigrationFilter states={listOfStates} label="Labour market" />);

            expect(screen.getByTestId("migration-list-search-by-name")).toHaveValue("Labour market");
        });
    });

    describe("onClick handler", () => {
        it("is called with single selected state", () => {
            render(<MigrationFilter states={listOfStates} />);

            fireEvent.click(screen.getByLabelText("Approved (4)"));
            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=approved");
        });

        it("is called with multiple selected states", () => {
            render(<MigrationFilter states={listOfStates} />);

            fireEvent.click(screen.getByLabelText("Approved (4)"));
            fireEvent.click(screen.getByLabelText("Submitted (2)"));
            fireEvent.click(screen.getByLabelText("In review (1)"));

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=approved%2Csubmitted%2Cin_review");
        });

        it("removes a state when checkbox is unchecked", () => {
            render(<MigrationFilter states={listOfStates} />);

            const approved = screen.getByLabelText("Approved (4)");
            const submitted = screen.getByLabelText("Submitted (2)");

            fireEvent.click(approved);
            fireEvent.click(submitted);

            fireEvent.click(approved);

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=submitted");
        });

        it("is called with the pathname when no states are selected", () => {
            render(<MigrationFilter states={listOfStates} />);

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration");
        });

        it("is called with the trimmed label and selected states", () => {
            render(<MigrationFilter states={listOfStates} />);

            fireEvent.change(screen.getByTestId("migration-list-search-by-name"), { target: { value: "  Labour & market " } });
            fireEvent.click(screen.getByLabelText("Approved (4)"));
            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=approved&label=Labour+%26+market");
        });

    });
});
