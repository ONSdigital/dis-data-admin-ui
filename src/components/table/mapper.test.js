import React from "react";

import { mapMigrationListTable, mapMigrationJobState } from "./mapper";

jest.mock("next/link", () => {
    return ({ href, children }) => <a href={href}>{children}</a>;
});

const formatDateMock = jest.fn((value) => `formatted-${value}`);
const isoToYYYYMMDDMock = jest.fn((value) => `yyyymmdd-${value}`);

jest.mock("@/utils/datetime/datetime", () => ({
    formatDate: (...args) => formatDateMock(...args),
    ISOToYYYYMMDD: (...args) => isoToYYYYMMDDMock(...args),
}));

describe("mapMigrationListTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("maps migration data into table headers and rows", () => {
        const data = [
            {
                job_number: 123,
                last_updated: "2025-10-12T00:00:00Z",
                label: "Series A",
                state: "approved",
            },
            {
                job_number: 456,
                last_updated: "2025-10-24T00:00:00Z",
                label: "Series B",
                state: "submitted",
            },
        ];

        const result = mapMigrationListTable(data);

        expect(result.headers).toEqual([
            { label: "Job ID", isSortable: true },
            { label: "Last updated", isSortable: true },
            { label: "Series name", isSortable: true },
            { label: "State", isSortable: true },
        ]);

        expect(result.body.rows).toHaveLength(2);

        const firstRow = result.body.rows[0];
        expect(firstRow.columns).toHaveLength(4);
        expect(firstRow.columns[0].sortValue).toBe("123");
        expect(firstRow.columns[0].content[0].props.href).toBe("/migration/123");
        expect(firstRow.columns[0].content[0].props.children).toBe("Job 123");

        expect(firstRow.columns[1].content).toBe("formatted-2025-10-12T00:00:00Z");
        expect(firstRow.columns[1].sortValue).toBe("yyyymmdd-2025-10-12T00:00:00Z");

        expect(firstRow.columns[2].content).toBe("Series A");
        expect(firstRow.columns[2].sortValue).toBe("Series A");

        expect(Array.isArray(firstRow.columns[3].content)).toBe(true);
        expect(firstRow.columns[3].sortValue).toBe("approved");

        expect(formatDateMock).toHaveBeenCalledWith("2025-10-12T00:00:00Z");
        expect(isoToYYYYMMDDMock).toHaveBeenCalledWith("2025-10-12T00:00:00Z");
    });

    test("returns empty rows when data is undefined", () => {
        const result = mapMigrationListTable(undefined);
        expect(result.body.rows).toEqual([]);
    });

    test("uses fallback when state is unknown", () => {
        const data = [
            {
                job_number: 999,
                last_updated: "2025-10-12T00:00:00Z",
                series_title: "Series X",
                state: "unknown-state",
            },
        ];

        const result = mapMigrationListTable(data);
        const stateCellContent = result.body.rows[0].columns[3].content;

        expect(stateCellContent).toBe("No state");
        expect(result.body.rows[0].columns[3].sortValue).toBe("unknown-state");
    });
});

describe("mapMigrationListTable", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("maps success states to success status component", () => {
        const result = mapMigrationJobState("approved", "key-1");

        expect(Array.isArray(result)).toBe(true);
        expect(result[0].type).toBe("span");
        expect(result[0].props.className).toBe("ons-status ons-status--success");
        expect(result[0].props.children).toBe("Approved");
        expect(result[0].key).toBe("key-1");
    });

    test("maps submitted state to pending status component", () => {
        const result = mapMigrationJobState("submitted", "key-2");

        expect(Array.isArray(result)).toBe(true);
        expect(result[0].props.className).toBe("ons-status ons-status--pending");
        expect(result[0].props.children).toBe("Submitted");
    });

    test("maps in-progress states to info status component and unslugifies text", () => {
        const result = mapMigrationJobState("in_review", "key-3");

        expect(Array.isArray(result)).toBe(true);
        expect(result[0].props.className).toBe("ons-status ons-status--info");
        expect(result[0].props.children).toBe("In Review");
    });

    test("maps cancelled state to dead status component", () => {
        const result = mapMigrationJobState("cancelled", "key-4");

        expect(Array.isArray(result)).toBe(true);
        expect(result[0].props.className).toBe("ons-status ons-status--dead");
        expect(result[0].props.children).toBe("Cancelled");
    });

    test("maps failed states to error status component", () => {
        const result = mapMigrationJobState("failed_migration", "key-5");

        expect(Array.isArray(result)).toBe(true);
        expect(result[0].props.className).toBe("ons-status ons-status--error");
        expect(result[0].props.children).toBe("Failed Migration");
    });
});
