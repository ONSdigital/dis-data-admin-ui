import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import Table from "./Table";

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

    test("sorts rows ascending and descending when clicking sortable header", async () => {
        render(<Table caption="Sortable table" contents={createTableContents()} dataTestId="sortable-table" />);

        const sortButton = screen.getByTestId("sortable-table-sort-button-name");

        const getRowOrder = () => [
            screen.getByTestId("sortable-table-cell-0-0").textContent,
            screen.getByTestId("sortable-table-cell-1-0").textContent,
        ];

        expect(getRowOrder()).toEqual(["Row B", "Row A"]);

        await userEvent.click(sortButton);
        expect(getRowOrder()).toEqual(["Row A", "Row B"]);

        await userEvent.click(sortButton);
        expect(getRowOrder()).toEqual(["Row B", "Row A"]); 
    });
});

