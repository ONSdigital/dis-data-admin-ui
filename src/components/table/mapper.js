import Link from "next/link";

import { formatDate, ISOToYYYYMMDD } from "@/utils/datetime/datetime";

/**
 * Renders a migration job state as an ONS-style status pill, or a fallback string.
 * @param {string} state - API state slug (e.g. `in_review`, `completed`).
 * @param {string} key - Stable React `key` for the returned element(s).
 * @returns {import("react").ReactNode | string} One or more `<span>` status nodes, or `"No state"` if unrecognised.
 */
const mapMigrationJobState = (state, key) => {
    // unslugify a string e.g. "in_review" becomes "In review"
    const unslugify = (slug) =>
        slug
            .replace(/_/g, " ")
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

/**
 * Map migration job data. One row per migration job with job id, dates, label, state.
 * @param {Array} data - Migration job list items from the API; omitted or empty yields no rows.
 * @returns {TableContents}
 */
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

/**
 * Map migration job tasks (e.g. editions and versions). One row per edition with a column of version links
 * @param {Array} data - Migration job tasks; tasks without `edition_id` or `version_id` are skipped.
 * @returns {TableContents} Empty `body.rows` when `data` is not a non-empty array.
 */
const mapMigrationJobTable = (data) => {
    const headers = [
        { label: "Editions", isSortable: false },
        { label: "Versions", isSortable: false }
    ];

    const body = {
        rows: []
    };

    if (!Array.isArray(data) || data.length === 0) {
        return { headers, body };
    }

    const datasetID = data[0].target?.dataset_id;

    const editionsMap = new Map();

    data.forEach((item) => {
        const editionID = item?.target?.edition_id;
        const versionID = item?.target?.version_id;
        if (editionID == null || versionID == null) {
            return;
        }
        const editionKey = String(editionID);
        if (!editionsMap.has(editionKey)) {
            editionsMap.set(editionKey, { versions: new Set() });
        }
        editionsMap.get(editionKey).versions.add(String(versionID));
    });

    editionsMap.forEach((edition, editionID) => {
        const sortedVersions = [...edition.versions].sort((a, b) => Number(a) - Number(b));

        const editionHref = `/data-admin/series/${datasetID}/editions/${editionID}`;

        body.rows.push({
            columns: [
                {
                    content: [
                        <Link
                            key={`migration-job-table-edition-${editionID}`}
                            href={editionHref}
                            data-TestId={`migration-job-table-edition-${editionID}`}
                        >
                            {editionID}
                        </Link>
                    ],
                    sortValue: editionID
                },
                {
                    content: [
                        <ul
                            key={`migration-job-table-${editionID}-versions`}
                            className="ons-u-mb-no ons-u-pl-no"
                            style={{ listStyleType: "none" }}
                        >
                            {sortedVersions.map((v) => {
                                const versionHref = `${editionHref}/versions/${v}`;
                                return (
                                    <li key={`${editionID}-${v}`}>
                                        <Link data-TestId={`migration-job-table-edition-${editionID}-${v}`} href={versionHref}>{`Version ${v}`}</Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ],
                    sortValue: sortedVersions.join(",")
                }
            ]
        });
    });

    return { headers, body };
};

export { mapMigrationListTable, mapMigrationJobState, mapMigrationJobTable };