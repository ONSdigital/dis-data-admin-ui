/**
 * Maps content to the design system <Summary> component.
 * Provides mappers for series, edition, uploaded files, and migration job summaries.
 */

import slugify from "slugify";
import Link from "next/link";

import { formatDate } from "@/utils/datetime/datetime";

/**
 * Returns the base structure for a Summary component model.
 * @param {string} [groupID="group"] - Identifier for the summary group
 * @returns {Array} Summary model with empty rows
 */
const getBaseSummaryModel = (groupID) => {
    return [{
        groups: [{   
            id: groupID || "group",
            rows: []
        }]
    }];
};

/**
 * Converts a string to a URL-safe slug in lowercase.
 * @param {string} [string] - String to slugify
 * @returns {string} Slugified string, or "no-value" if input is falsy
 */
const slugifyLowerCase = (string) => {
    if (!string) return "no-value";
    return slugify(string, {lower: true});
};

/**
 * Maps a single row into the Summary component row format and pushes it onto rows.
 * @param {string} itemName - Row label/title
 * @param {string|Array} value - Row value, or array of values when multiValue is true
 * @param {boolean} [multiValue] - If true, value is treated as an array of values
 * @param {Object} [action] - Optional action (e.g. Edit link) for the row
 * @param {Array} rows - Array to push the new row object onto (mutated)
 */
const mapRow = (itemName, value, multiValue, action, rows) => {

    const mapItemValue = (value, multiValue) => {
        if (multiValue) {
            return value.map(val => {return {text: val};});
        }
        return [{
            text: value || "No value found"
        }];
    };

    const item = {
        id: `row-${slugifyLowerCase(itemName)}`,
        rowTitle: itemName,
        rowItems: [
            {
                id: slugifyLowerCase(itemName),
                valueList: mapItemValue(value, multiValue),
            }
        ]
    };

    if (action) {
        item.rowItems[0].actions = [
            {
                id: `action-link-${slugifyLowerCase(itemName)}`,
                dataTestId: `action-link-${slugifyLowerCase(itemName)}`,
                text: action.text,
                visuallyHiddenText: `${action.text} ${itemName}`,
                url: action.url ? `${action.url}#${action.anchorIDPrefix}${slugifyLowerCase(itemName)}` : "#",
                onClick: action.onClick ? (e) => { action.onClick(e, itemName); } : null
            }
        ];
    }
    rows.push(item);
};

/**
 * Maps series/dataset metadata to Summary component model.
 * @param {Object} data - Series metadata (id, type, title, description, contacts, etc.)
 * @param {string} editBaseURL - Base URL for edit actions
 * @param {Array} [topicTitles] - Resolved topic titles for the series topics
 * @returns {Array} Summary model for series metadata
 */
const mapSeriesSummary = (data, editBaseURL, topicTitles) => {
    const contentBody = getBaseSummaryModel("series-metadata");
    const rows = contentBody[0].groups[0].rows;
    const action = {
        url: editBaseURL,
        onClick: null,
        anchorIDPrefix: "dataset-series-",
        text: "Edit"
    };
    const contacts = [];
    data?.contacts?.forEach(contact => {
        contacts.push(contact.name);
    });

    mapRow("Series ID", data.id, null, null, rows);
    mapRow("Type", data.type, null, null, rows);
    mapRow("Title", data.title, null, action, rows);
    mapRow("Description", data.description, null, action, rows);

    if (topicTitles && topicTitles.length > 0) {
        mapRow("Topics", topicTitles, true, action, rows);
    }

    mapRow("Last updated", formatDate(data.last_updated), null, null, rows);
    mapRow("Licence", data.license, null, null, rows);
    mapRow("Next release", data.next_release, null, null, rows);

    if (data.keywords && data.keywords.length > 0) {
        mapRow("Keywords", data.keywords, true, action, rows);
    }

    mapRow("QMI", data.qmi?.href, null, action, rows);

    if (data.publisher?.name) {
        mapRow("Publisher", data.publisher.name, null, null, rows);
    }
    mapRow("Contacts", contacts, true, action, rows);
    return contentBody;
};

/**
 * Maps edition metadata to Summary component model.
 * @param {Object} edition - Edition metadata (edition, edition_title, release_date, state)
 * @param {string} editBaseURL - Base URL for edit actions
 * @returns {Array} Summary model for edition metadata
 */
const mapEditionSummary = (edition, editBaseURL) => {
    const contentBody = getBaseSummaryModel("edition-metadata");
    const rows = contentBody[0].groups[0].rows;
    const action = {
        url: editBaseURL,
        onClick: null,
        anchorIDPrefix: "",
        text: "Edit"
    };
    const isPublished = edition?.state === "published";

    mapRow("Edition ID", edition.edition, null, !isPublished ? action : null, rows);
    mapRow("Edition title", edition.edition_title, null, action, rows);
    mapRow("Release date", formatDate(edition.release_date), null, null, rows);
    return contentBody;
};

/**
 * Maps uploaded files to Summary component model with delete action.
 * @param {Array} files - List of uploaded file objects
 * @param {function} actionOnClick - Callback for delete action (e.g. (e, itemName) => void)
 * @returns {Array} Summary model for uploaded files list
 */
const mapUploadedFilesSummary = (files, actionOnClick) => {
    const contentBody = getBaseSummaryModel("uploaded-files-list");
    const rows = contentBody[0].groups[0].rows;
    const action = {
        url: null,
        onClick: actionOnClick,
        anchorIDPrefix: null,
        text: "Delete file"
    };
    files.forEach(file => {
        mapRow(file.title  || file.download_url, " ", null, action, rows);
    });
    return contentBody;
};

/**
 * Adds a single migration job row (with link) to the Summary rows array.
 * @param {string} itemName - Row label (e.g. "Series", "Edition", "Version")
 * @param {string} value - Display value and link text
 * @param {string} valueURL - URL for the row link
 * @param {Array} rows - Summary rows array to push onto (mutated)
 */
const mapMigrationRow = (itemName, value, valueURL, rows) => {
    const item = {
        id: `row-${slugifyLowerCase(itemName)}-${slugifyLowerCase(value)}`,
        rowTitle: itemName,
        rowItems: [
            {
                id: slugifyLowerCase(itemName),
                valueList: [{text: [<Link key={`link-${itemName}-${value}`} href={valueURL}>{value}</Link>]}],
            }
        ]
    };
    rows.push(item);
};

/**
 * Maps migration job tasks to Summary component model.
 * Handles dataset_series, dataset_edition, and dataset_version task types; editions and versions are sorted before rendering.
 * @param {Array} tasks - Migration job tasks (type: "dataset_series" | "dataset_edition" | "dataset_version", target with id, dataset_id, edition_id as needed)
 * @returns {Array} Summary model for migration job list
 */
const mapMigrationJobSummary = (tasks) => {
    const contentBody = getBaseSummaryModel("migration-job-list");
    const rows = contentBody[0].groups[0].rows;
    const baseURL = "/series";
    const edtitionsAndVersions = [];
    tasks.forEach(task => {
        switch(task.type) {
            case "dataset_series":
                mapMigrationRow("Series", task.target.id, `${baseURL}/${task.target.id}`, rows);
                break;
            case "dataset_edition":
                edtitionsAndVersions.push({
                    edition: task.target.id, 
                    version: 0, 
                    url: `${baseURL}/${task.target.dataset_id}/editions/${task.target.id}`
                });
                break;
            case "dataset_version":
                edtitionsAndVersions.push({
                    edition: task.target.edition_id, 
                    version: task.target.id, 
                    url: `${baseURL}/${task.target.dataset_id}/editions/${task.target.edition_id}/versions/${task.target.id}`
                });
                break;
            default:
                // do nothing with task type "dataset_download" or others as we don't want to map those
                break;
        }
    });

    // order editions and versions
    const sortedEdtitionsAndVersions = edtitionsAndVersions.toSorted((a, b) => {
        return a.edition.localeCompare(b.edition) || Number(a.version) - Number(b.version);
    });

    sortedEdtitionsAndVersions.forEach(version => { 
        const itemType = version.version === 0 ? "Edition" : "Version";
        const itemValue = version.version === 0 ? version.edition : version.version;
        mapMigrationRow(itemType, itemValue, version.url, rows);
    });

    return contentBody;
};

export { mapSeriesSummary, mapEditionSummary, mapUploadedFilesSummary, mapMigrationJobSummary };
