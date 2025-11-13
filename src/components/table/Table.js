"use client";

import { useState } from "react";
import { sanitiseString } from "author-design-system-react";

export default function Table({ contents, caption, classes, dataTestId  }) {
    const [rows, setRows] = useState(contents?.body?.rows || []);
    const [sorted, setSorted] = useState();

    const sanitisedDataTestId = sanitiseString(dataTestId);

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
                    {contents?.headers.map((header, index) => {
                        const sanitisedHeaderLabel = sanitiseString(header.label);
                        return (
                            <th scope="col" className="ons-table__header" aria-sort="none" key={header.label + index} data-testid={`${sanitisedDataTestId}-header-${sanitisedHeaderLabel}`}>
                                {header.isSortable ?
                                    <button aria-label="Sort by Legal basis" type="button" data-testid={`${sanitisedDataTestId}-sort-button-${sanitisedHeaderLabel}`} className="ons-table__sort-button" onClick={() => {handleSort(index)}}>
                                        {header.label}
                                        <svg id="sort-sprite-legal-basis-0" className="ons-icon" viewBox="0 0 12 19" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="currentColor" role="img" aria-hidden="true">
                                            <path className="ons-topTriangle" d="M6 0l6 7.2H0L6 0zm0 18.6l6-7.2H0l6 7.2zm0 3.6l6 7.2H0l6-7.2z"></path>
                                            <path className="ons-bottomTriangle" d="M6 18.6l6-7.2H0l6 7.2zm0 3.6l6 7.2H0l6-7.2z"></path>
                                        </svg>
                                    </button>
                                    :
                                    <span data-testid={`${sanitisedDataTestId}-header-label-${sanitisedHeaderLabel}`} className="ons-table__header-text">{header.label}</span>
                                }
                            </th>
                        )
                    })}
                </tr>
            </thead>
        )
    };

    const renderTableBody = () => {
        if (!rows.length) {
            return (
                <tbody className="ons-table__body"><tr><td data-testid={`${sanitisedDataTestId}-no-data`}>No data available</td></tr></tbody>
            )
        }
        return (
            <tbody className="ons-table__body">
                {rows.map((row, index) => {
                    return (
                        <tr className="ons-table__row" key={`row-${index}`}>
                            {row.columns.map((cell, i) => {
                                return (
                                    <td className="ons-table__cell" key={`row-${index}cell-${i}`} data-testid={`${sanitisedDataTestId}-cell-${index}-${i}`}>{cell.content}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        )
    };

    return (
        <div className={"ons-table-scrollable ons-table-scrollable--on " + classes}>
            <div className="ons-table-scrollable__content" tabIndex="0" role="region" aria-label="JavaScript enhanced sortable table. Scrollable table">
                <table data-testid={dataTestId} className="ons-table ons-table--sortable" data-aria-sort="Sort by" data-aria-asc="ascending" data-aria-desc="descending">
                    { caption && <caption data-testid={`${sanitisedDataTestId}-caption`} className="ons-table__caption"> {caption} </caption>}
                    { renderTableHeader() }
                    { renderTableBody() }
                </table>
            </div>
        </div>
    );
}
