import Link from "next/link";

import { formatDate, ISOToYYYYMMDD } from "@/utils/datetime/datetime";

const mapMigrationJobState = (state, key) => {
    switch(state) {
        case "approved":
            return [<span key={key} className="ons-status ons-status--success">Approved</span>];
        case "in_review":
            return [<span key={key} className="ons-status ons-status--pending">In review</span>];
        case "submitted":
            return [<span key={key} className="ons-status ons-status--pending">Submitted</span>];
        case "reverted":
            return [<span key={key} className="ons-status ons-status--dead">Reverted</span>];
        default:
            return "No state";
    }
};

const mapMigrationListTable = (data) => {
    const headers = [
        { label: "Job ID", isSortable: true },
        { label: "Last updated", isSortable: true },
        { label: "Series name", isSortable: true },
        { label: "State", isSortable: true }
    ];

    const body =  {
        rows: []
    };

    data?.forEach((item, index) => {
        body.rows.push(
            { 
                columns: [
                    { content: [<Link key={`migration-list-table-link-${index}`} href={`/migration/${item.job_number}`}>{item.job_number}</Link>], sortValue: item.job_number },
                    { content: formatDate(item.last_updated), sortValue: ISOToYYYYMMDD(item.last_updated) },
                    { content: item.label, sortValue: item.label },
                    { content: mapMigrationJobState(item.state, `migration-list-table-state-${index}`), sortValue: item.state }
                ]
            }
        );
    });

    return { headers, body };
};

export { mapMigrationListTable };