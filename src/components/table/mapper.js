import Link from "next/link";

import { formatDate, ISOToYYYYMMDD } from "@/utils/datetime/datetime";

const mapMigrationJobState = (state, key) => {
    // unslufgy a string e.g. "in_review" becomes "In review"
    const unslugify = (slug) =>
        slug
            .replace(/\_/g, " ")
            .toLowerCase()
            .replace(/^./, (char) => char.toUpperCase());
    const userFriendlyStateLabel = unslugify(state);
    
    switch(state) {
        case "approved":
        case "published":
        case "completed":
            // green status colour
            return [<span key={key} className="ons-status ons-status--success">{userFriendlyStateLabel}</span>];
        case "submitted":
            // orange status colour
            return [<span key={key} className="ons-status ons-status--pending">{userFriendlyStateLabel}</span>];
        case "in_review":
        case "migrating":
        case "publishing":
        case "post_publishing":
        case "reverting":
            // blue status
            return [<span key={key} className="ons-status ons-status--info">{userFriendlyStateLabel}</span>];
        case "cancelled":
            // grey status colour
            return [<span key={key} className="ons-status ons-status--dead">{userFriendlyStateLabel}</span>];
        case "failed_publish":
        case "failed_post_publish":
        case "failed_migration":
            // red status colour
            return [<span key={key} className="ons-status ons-status--error">{userFriendlyStateLabel}</span>];
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
                    { 
                        content: [<Link key={`migration-list-table-link-${index}`} href={`/migration/${item.job_number}`}>{`Job ${item.job_number}`}</Link>], 
                        sortValue: item.job_number.toString() 
                    },
                    { content: formatDate(item.last_updated), sortValue: ISOToYYYYMMDD(item.last_updated) },
                    { content: item.label, sortValue: item.label },
                    { content: mapMigrationJobState(item.state, `migration-list-table-state-${index}`), sortValue: item.state }
                ]
            }
        );
    });

    return { headers, body };
};

export { mapMigrationListTable, mapMigrationJobState };