import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Table from "./Table";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        replace: mockReplace,
    })),
    usePathname: jest.fn(() => "/migration"),
    useSearchParams: jest.fn(() => new URLSearchParams()),
}));

const createTableContents = (overrides = {}) => ({
    headers: [
        { label: "Name", isSortable: true },
        { label: "Value", isSortable: false },
    ],
    body: {
        rows: [
            {
                columns: [
                    { content: "Row B", sortValue: "row-b" },
                    { content: "Value B" },
                ],
            },
            {
                columns: [
                    { content: "Row A", sortValue: "row-a" },
                    { content: "Value A" },
                ],
            },
        ],
    },
    ...overrides,
});

describe("Table", () => {
    beforeEach(() => {
        mockReplace.mockClear();
    });

    test("renders table with caption, headers, and rows", () => {
        render(<Table caption="Test caption" classes="custom-class" contents={createTableContents()} dataTestId="test-table" />);

        expect(screen.getByTestId("test-table-caption")).toBeInTheDocument();
        expect(screen.getByTestId("test-table")).toBeInTheDocument();
        expect(screen.getByTestId("test-table-header-name")).toBeInTheDocument();
        expect(screen.getByTestId("test-table-header-value")).toBeInTheDocument();
        expect(screen.getByTestId("test-table-cell-0-0")).toHaveTextContent("Row B");
        expect(screen.getByTestId("test-table-cell-1-0")).toHaveTextContent("Row A");
    });

    test("renders fallback when there are no rows", () => {
        render(<Table caption="Empty table" contents={{ headers: [{ label: "Empty", isSortable: false }], body: { rows: [] }}} dataTestId="test-table"/>);
        
        expect(screen.getByTestId("test-table-no-data")).toHaveTextContent("No data available");
    });

    test("sorts rows ascending and descending via sortBy prop", () => {
        const getRowOrder = () => [
            screen.getByTestId("sortable-table-cell-0-0").textContent,
            screen.getByTestId("sortable-table-cell-1-0").textContent,
        ];

        const { rerender } = render(
            <Table caption="Sortable table" contents={createTableContents()} dataTestId="sortable-table" />
        );

        expect(getRowOrder()).toEqual(["Row B", "Row A"]);

        rerender(
            <Table caption="Sortable table" contents={createTableContents()} dataTestId="sortable-table" sortBy="0:asc" />
        );
        expect(getRowOrder()).toEqual(["Row A", "Row B"]);

        rerender(
            <Table caption="Sortable table" contents={createTableContents()} dataTestId="sortable-table" sortBy="0:desc" />
        );
        expect(getRowOrder()).toEqual(["Row B", "Row A"]);
    });

    test("updates sort query when clicking sortable header", async () => {
        render(<Table caption="Sortable table" contents={createTableContents()} dataTestId="sortable-table" />);

        const sortButton = screen.getByTestId("sortable-table-sort-button-name");

        await userEvent.click(sortButton);
        expect(mockReplace).toHaveBeenCalledWith("/migration?sort=0%3Aasc");
    });

    test("toggles sort direction when clicking the same column with sortBy set", async () => {
        render(
            <Table caption="Sortable table" contents={createTableContents()} dataTestId="sortable-table" sortBy="0:asc" />
        );

        const sortButton = screen.getByTestId("sortable-table-sort-button-name");

        await userEvent.click(sortButton);
        expect(mockReplace).toHaveBeenCalledWith("/migration?sort=0%3Adesc");
    });
});
