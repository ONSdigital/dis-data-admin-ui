"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { sanitiseString } from "author-design-system-react";

export default function Table({ contents, caption, classes, dataTestId, noResultsText = "No data available", sortBy = null }) {
    const [rows, setRows] = useState(contents?.body?.rows || []);
    const [sorted, setSorted] = useState();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    useEffect(() => {
        if (!sortBy) { 
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRows(contents?.body?.rows || []); 
        } else {
            const sortByStr = sortBy.split(":");
            const sortIndex = sortByStr[0];
            const sortDirection = sortByStr[1];
            doSort(sortIndex, sortDirection)
        }
    }, [contents]);

    const sanitisedDataTestId = sanitiseString(dataTestId);

    const handleSortClick = (rowIndex, sortDirection) => {
        const allParams = new URLSearchParams(Array.from(params.entries()));
        allParams.set("sort", `${rowIndex}:${sortDirection}`);
        router.replace(`${pathname}?${allParams.toString()}`);
    }

    const doSort = (rowIndex, sortDirection) => {
        const isDescending = sortDirection === "desc";
        const sortColumnIndex = Number(rowIndex);
        const sourceRows = contents?.body?.rows || [];
        
        const sortedRows = [...sourceRows].sort((a, b) => {
            const sortValueA = a.columns[sortColumnIndex]?.sortValue || "";
            const sortValueB = b.columns[sortColumnIndex]?.sortValue || "";
            
            if (isDescending) {
                return sortValueB.localeCompare(sortValueA);
            }
            return sortValueA.localeCompare(sortValueB);
        });
        
        setRows(sortedRows);
        setSorted({ rowIndex: sortColumnIndex, order: isDescending ? "desc" : "asc" });
    }

    const renderTableHeader = () => {
        return (
            <thead className="ons-table__head">
                <tr className="ons-table__row">
                    {contents?.headers.map((header, index) => {
                        const sanitisedHeaderLabel = sanitiseString(header.label);
                        const headerClass = `ons-table__header ${header?.rightAlign && "ons-table__header--numeric"}`;
                        return (
                            <th scope="col" className={headerClass} aria-sort="none" 
                                key={header.label + index} data-testid={`${sanitisedDataTestId}-header-${sanitisedHeaderLabel}`}
                            >
                                {header.isSortable ?
                                    <button aria-label="Sort by Legal basis" type="button" 
                                        data-testid={`${sanitisedDataTestId}-sort-button-${sanitisedHeaderLabel}`} 
                                        className="ons-table__sort-button" 
                                        onClick={() => {
                                            handleSortClick(index, index === sorted?.rowIndex ? sorted?.order === "asc" ? "desc" : "asc" : "asc")
                                        }}
                                    >
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
                        );
                    })}
                </tr>
            </thead>
        );
    };

    const renderTableBody = () => {
        if (!rows.length) {
            return (
                <tbody className="ons-table__body"><tr><td data-testid={`${sanitisedDataTestId}-no-data`}>{noResultsText}</td></tr></tbody>
            );
        }
        return (
            <tbody className="ons-table__body">
                {rows.map((row, index) => {
                    return (
                        <tr className="ons-table__row" key={`row-${index}`}>
                            {row.columns.map((cell, i) => {
                                const cellClass = `ons-table__cell ${cell?.rightAlign && "ons-table__cell--numeric"}`;
                                return (
                                    <td className={cellClass} key={`row-${index}cell-${i}`} data-testid={`${sanitisedDataTestId}-cell-${index}-${i}`}>
                                        {cell.content}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        );
    };

    return (
        <div className={"ons-table-scrollable " + classes}>
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
