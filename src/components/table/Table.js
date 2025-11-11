"use client";

import { useState } from "react";

export default function Table({ query, message }) {
    const headers = [
        { label: "Job ID", isSortable: false },
        { label: "Last update", isSortable: false },
        { label: "Series name", isSortable: true },
        { label: "State", isSortable: true }
    ];

    const body = {
        rows: [
            { columns: [{ content: "1" }, { content: "12 October 2025" }, { content: "CPIH01", sortValue: "c" }, { content: [<span className="ons-status ons-status--pending">Submitted</span>], sortValue: "submitted" }] },
            { columns: [{ content: "2" }, { content: "24 October 2025" }, { content: "LMS", sortValue: "l" }, { content: [<span className="ons-status ons-status--pending">In review</span>], sortValue: "review" }] },
            { columns: [{ content: "3" }, { content: "05 October 2025" }, { content: "THINGS", sortValue: "t" }, { content: [<span className="ons-status ons-status--success">Approved</span>], sortValue: "approved" }] },
            { columns: [{ content: "4" }, { content: "13 October 2025" }, { content: "FOO", sortValue: "f" }, { content: [<span className="ons-status ons-status--dead">Reverted</span>], sortValue: "reverted" }] },
            { columns: [{ content: "5" }, { content: "28 October 2025" }, { content: "BAR", sortValue: "b" }, { content: [<span className="ons-status ons-status--success">Approved</span>], sortValue: "approved" }] }
        ]
    };

    const [rows, setRows] = useState(body.rows || []);
    const [sorted, setSorted] = useState()

    const handleSort = (rowIndex) => {
        const isSameColumn = sorted?.rowIndex === rowIndex;
        const isAscending = sorted?.order === "ascending";
        const shouldSortDescending = isSameColumn && isAscending;
        
        const sortedRows = [...rows].sort((a, b) => {
            const sortValueA = a.columns[rowIndex]?.sortValue || "";
            const sortValueB = b.columns[rowIndex]?.sortValue || "";
            
            if (shouldSortDescending) {
                return sortValueB.localeCompare(sortValueA);
            } else {
                return sortValueA.localeCompare(sortValueB);
            }
        });
        
        setRows(sortedRows);
        setSorted({ 
            rowIndex, 
            order: shouldSortDescending ? "descending" : "ascending" 
        });
    }

    const renderTableHeader = () => {
        return (
            <thead className="ons-table__head">
                <tr className="ons-table__row">
                    {headers.map((header, index) => {
                        return (
                            <th scope="col" className="ons-table__header" aria-sort="none" key={header.label + index}>
                                {header.isSortable ?
                                    <button aria-label="Sort by Legal basis" type="button" data-index="3" className="ons-table__sort-button" onClick={() => {handleSort(index)}}>
                                        {header.label}
                                        <svg id="sort-sprite-legal-basis-0" className="ons-icon" viewBox="0 0 12 19" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor" role="img" aria-hidden="true">
                                            <path className="ons-topTriangle" d="M6 0l6 7.2H0L6 0zm0 18.6l6-7.2H0l6 7.2zm0 3.6l6 7.2H0l6-7.2z"></path>
                                            <path className="ons-bottomTriangle" d="M6 18.6l6-7.2H0l6 7.2zm0 3.6l6 7.2H0l6-7.2z"></path>
                                        </svg>
                                    </button>
                                    :
                                    <span className="ons-table__header-text">{header.label}</span>
                                }
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    };

    const renderTableBody = () => {
        return (
            <tbody className="ons-table__body">
                {rows.map((row, index) => {
                    return (
                        <tr className="ons-table__row" key={`row-${index}`}>
                            {row.columns.map((cell, i) => {
                                return (
                                    <td className="ons-table__cell" key={`row-${index}cell-${i}`}>{cell.content}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        )
    };

    return (
        <div className="ons-table-scrollable ons-table-scrollable--on">
            <div className="ons-table-scrollable__content" tabIndex="0" role="region" aria-label="JavaScript enhanced sortable table. Scrollable table">
                <table className="ons-table ons-table--sortable" data-aria-sort="Sort by" data-aria-asc="ascending" data-aria-desc="descending">
                    <caption className="ons-table__caption"> JavaScript enhanced sortable table </caption>
                    {renderTableHeader()}
                    {renderTableBody()}
                </table>
            </div>
        </div>
    );
}
