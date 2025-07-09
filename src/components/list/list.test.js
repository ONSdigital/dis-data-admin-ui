import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"
import List from "./List";

let contents =  [
    {
        "title": "Test dataset",
        "description": "Something about a test dataset",
        "id": "test-dataset"
    },
    {
        "title": "Consumer prices",
        "description": "Something about consumer prices",
        "id": "cpih"
    },
    {
        "title": "Weekly deaths",
        "description": "Something about weekly deaths",
        "id": "weekly-deaths"
    }
];

describe("List", () => {
    it("renders no results", () => {
        render(<List items={[]} />);
        const noResultsText = screen.getByText(/No results/);
        expect(noResultsText).toBeInTheDocument();
    });

    it("renders custom no results message", () => {
        render(<List items={[]} noResultsText={"No items"} />);
        const noResultsText = screen.getByText(/No items/);
        expect(noResultsText).toBeInTheDocument();
    });

    it("renders correctly when given list of contents", () => {
        render(<List type="series" items={contents} />);

        const listItems = screen.getAllByRole("heading")
        expect(listItems.length).toBe(3)

        const itemLink = screen.getByTestId("list-item-0-link")
        expect(itemLink).toBeInTheDocument();

        const itemLinkText = screen.getByRole("heading", {name: /Test dataset/i});
        expect(itemLinkText).toBeInTheDocument();

        const itemID = screen.getByTestId("list-item-0-id")
        expect(itemID).toBeInTheDocument();

        const itemIDText = screen.getByText(/test-dataset/);
        expect(itemIDText).toBeInTheDocument();
    });

    it("renders correctly when given list of contents with state", () => {
        contents[0].state = "Published"
        render(<List items={contents} />);

        const itemState = screen.getByTestId("list-item-0-state");
        expect(itemState).toBeInTheDocument();

        const itemStateText = screen.getByText(/Published/);
        expect(itemStateText).toBeInTheDocument();
    });

});
