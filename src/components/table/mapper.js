import Link from "next/link";

import { formatDate, ISOToYYYYMMDD } from "@/utils/datetime/datetime";

const mapMigrationJobState = (state) => {
    switch(state) {
        case "approved":
            return [<span className="ons-status ons-status--success">Approved</span>];
        case "in_review":
            return [<span className="ons-status ons-status--pending">In review</span>];
        case "submitted":
            return [<span className="ons-status ons-status--pending">Submitted</span>];
        case "reverted":
            return [<span className="ons-status ons-status--dead">Reverted</span>];
        default:
            return "No state"
    }
}

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

    data?.forEach(item => {
        body.rows.push(
            { 
                columns: [
                    { content: [<Link href={`/data-admin/migration/${item.id}`}>{item.id}</Link>], sortValue: item.id },
                    { content: formatDate(item.last_updated), sortValue: ISOToYYYYMMDD(item.last_updated) },
                    { content: item.series_title, sortValue: item.series_title },
                    { content: mapMigrationJobState(item.state), sortValue: item.state }
                ]
            }
        );
    })

    return { headers, body };
};

export { mapMigrationListTable };