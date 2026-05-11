import Link from "next/link";

import { formatDate, ISOToYYYYMMDD } from "@/utils/datetime/datetime";

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

const compareversionIDs = (a, b) => {
    const na = Number(a);
    const nb = Number(b);
    const aIsNumeric = !Number.isNaN(na) && String(na) === String(a).trim();
    const bIsNumeric = !Number.isNaN(nb) && String(nb) === String(b).trim();
    if (aIsNumeric && bIsNumeric) {
        return na - nb;
    }
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
};

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
        const sortedVersions = [...edition.versions].sort(compareversionIDs);

        const editionHref = `/data-admin/series/${datasetID}/editions/${editionID}`;

        body.rows.push({
            columns: [
                {
                    content: [
                        <Link
                            key={`migration-job-table-edition-${datasetID}-${editionID}`}
                            href={editionHref}
                        >
                            {editionID}
                        </Link>
                    ],
                    sortValue: editionID
                },
                {
                    content: [
                        <ul
                            key={`migration-job-table-versions-${datasetID}-${editionID}`}
                            className="ons-u-mb-no ons-u-pl-no"
                            style={{ listStyleType: "none" }}
                        >
                            {sortedVersions.map((v) => {
                                const versionHref = `${editionHref}/versions/${v}`;
                                return (
                                    <li key={`${editionID}-${v}`}>
                                        <Link href={versionHref}>{`Version ${v}`}</Link>
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