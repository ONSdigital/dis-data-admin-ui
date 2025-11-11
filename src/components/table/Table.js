"use client";

export default function Table({ query, message }) {
    const headers = [
        { label: "Job ID", sortable: false },
        { label: "Last update", sortable: false },
        { label: "Series name", sortable: false },
        { label: "State", sortable: false }
    ];

    const body = {
        rows: [
            {columns: [{ content: "1" }, { content: "12 October 2025" }, { content: "CPIH01" }, { content: [<span className="ons-status ons-status--pending">Submitted</span>] }]},
            {columns: [{content: "2" }, { content: "24 October 2025" }, { content: "LMS" }, { content: [<span className="ons-status ons-status--pending">In review</span>] }]},
            {columns: [{content: "3" }, { content: "05 October 2025" }, { content: "THINGS" }, { content: [<span className="ons-status ons-status--success">Approved</span>] }]},
            {columns: [{content: "4" }, { content: "13 October 2025" }, { content: "FOO" }, { content: [<span className="ons-status ons-status--dead">Reverted</span>] }]},
            {columns: [{content: "5" }, { content: "28 October 2025" }, { content: "BAR" }, { content: [<span className="ons-status ons-status--success">Approved" </span>]} ]}
        ]
    };

    const renderTableHeader = () => {
        return (
            <thead className="ons-table__head">
                <tr className="ons-table__row">
                    {headers.map((header, index) => {
                        return (
                            <th scope="col" className="ons-table__header" aria-sort="none" key={header.label + index}>
                                <span className="ons-table__header-text">{header.label}</span>
                                <svg id="sort-sprite-id" className="ons-icon ons-u-d-no" viewBox="0 0 12 19" xmlns="http://www.w3.org/2000/svg"
                                    focusable="false" fill="black" role="img" aria-hidden="true">
                                    <path className="ons-topTriangle" d="M6 0l6 7.2H0L6 0zm0 18.6l6-7.2H0l6 7.2zm0 3.6l6 7.2H0l6-7.2z" />
                                    <path className="ons-bottomTriangle" d="M6 18.6l6-7.2H0l6 7.2zm0 3.6l6 7.2H0l6-7.2z" />
                                </svg>
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
                {body.rows.map((row, index) => {
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
