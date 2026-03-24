import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import MigrationFilter from "./MigrationFilter";

import { useRouter, usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn(),
    }),
    usePathname: jest.fn().mockReturnValue("/migration"),
}));

describe("MigrationFilter", () => {
    let router;

    beforeEach(() => {
        router = useRouter();
        router.push.mockClear();
    });

    describe("renders correctly", () => {
        it("renders the checkbox list and apply button", () => {
            render(<MigrationFilter />);

            expect(screen.getByTestId("fieldset-state-filter")).toBeInTheDocument();
            expect(screen.getByLabelText("Approved")).toBeInTheDocument();
            expect(screen.getByLabelText("Submitted")).toBeInTheDocument();
            expect(screen.getByLabelText("In review")).toBeInTheDocument();
            expect(screen.getByLabelText("Reverted")).toBeInTheDocument();

            expect(screen.getByTestId("migration-filter-apply-button")).toBeInTheDocument();
        });
    });

    describe("onClick handler", () => {
        it("is called with single selected state", () => {
            render(<MigrationFilter />);

            fireEvent.click(screen.getByLabelText("Approved"));
            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=approved");
        });

        it("is called with multiple selected states", () => {
            render(<MigrationFilter />);

            fireEvent.click(screen.getByLabelText("Approved"));
            fireEvent.click(screen.getByLabelText("Submitted"));
            fireEvent.click(screen.getByLabelText("In review"));

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=approved,submitted,in_review");
        });

        it("removes a state when checkbox is unchecked", () => {
            render(<MigrationFilter />);

            const approved = screen.getByLabelText("Approved");
            const submitted = screen.getByLabelText("Submitted");

            fireEvent.click(approved);
            fireEvent.click(submitted);

            // Uncheck approved
            fireEvent.click(approved);

            fireEvent.click(screen.getByTestId("migration-filter-apply-button"));

            expect(router.push).toHaveBeenCalledTimes(1);
            expect(router.push).toHaveBeenCalledWith("/migration?state=submitted");
        });

    });
});
