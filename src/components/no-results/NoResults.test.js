import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import NoResults from "./NoResults";

describe("NoResults", () => {
    it("renders the no results message and guidance", () => {
        render(<NoResults searchQuery="test search" />);

        expect(screen.getByTestId("no-results-message")).toHaveTextContent("test search");
        expect(screen.getByTestId("no-results-list")).toBeInTheDocument();
        expect(screen.getByText(/A few things you could try:/i)).toBeInTheDocument();
        expect(screen.getByText(/Check your spelling\./i)).toBeInTheDocument();
        expect(screen.getByText(/Try an alternative search term\./i)).toBeInTheDocument();
        expect(screen.getByText(/What you're looking for may not yet exist\./i)).toBeInTheDocument();
        expect(screen.queryByTestId("no-results-create-new-entry-link")).not.toBeInTheDocument();
    });

    it("renders a create new entry link when createURL is provided", () => {
        render(<NoResults searchQuery="test search" createURL="/create" />);

        const createLink = screen.getByTestId("no-results-create-new-entry-link");
        expect(createLink).toBeInTheDocument();
        expect(createLink).toHaveAttribute("href", "/create");
    });
});
