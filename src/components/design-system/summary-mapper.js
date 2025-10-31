// map content to design system <Summary> component

import slugify from "slugify";

import { formatDate } from "@/utils/datetime/datetime";

// return <Summary> component basic model
const getBaseSummaryModel = (groupID) => {
    return [{
        groups: [{   
            id: groupID || "group",
            rows: []
        }]
    }];
};

// map a <Summary> component row
const mapRow = (itemName, value, multiValue, hasAction, actionURL, actionOnClick, actionAnchorIDPrefix, rows) => {
    const slugifyLowerCase = (string) => {
        return slugify(string, {lower: true});
    };

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

    if (hasAction) {
        item.rowItems[0].actions = [
            {
                id: `edit-${slugifyLowerCase(itemName)}`,
                dataTestId: `edit-${slugifyLowerCase(itemName)}`,
                text: "Edit",
                visuallyHiddenText: `Edit ${itemName}`,
                url: `${actionURL}#${actionAnchorIDPrefix}${slugifyLowerCase(itemName)}`,
                onClick: actionOnClick || null
            }
        ];
    }
    rows.push(item);
};

const mapSeriesSummary = (data, editBaseURL, topicTitles) => {
    const contentBody = getBaseSummaryModel("series-metadata");
    const rows = contentBody[0].groups[0].rows;
    const actionAnchorIDPrefix = "dataset-series-";
    const contacts = [];
    data.contacts.forEach(contact => {
        contacts.push(contact.name);
    });

    mapRow("Series ID", data.id, false, false, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Type", data.type, false, false, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Title", data.title, false, true, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Description", data.description, false, true, editBaseURL, null, actionAnchorIDPrefix, rows);

    if (topicTitles && topicTitles.length > 0) {
        mapRow("Topics", topicTitles, true, true, editBaseURL, null, actionAnchorIDPrefix, rows);
    }

    mapRow("Last updated", formatDate(data.last_updated), false, false, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Licence", data.license, false, false, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Next release", data.next_release, false, false, editBaseURL, null, actionAnchorIDPrefix, rows);

    if (data.keywords && data.keywords.length > 0) {
        mapRow("Keywords", data.keywords, true, true, editBaseURL, null, actionAnchorIDPrefix, rows);
    }

    mapRow("QMI", data.qmi?.href, false, true, editBaseURL, null, actionAnchorIDPrefix, rows);

    if (data.publisher?.name) {
        mapRow("Publisher", data.publisher.name, false, false, editBaseURL, null, actionAnchorIDPrefix, rows);
    }
    mapRow("Contacts", contacts, true, true, editBaseURL, null, actionAnchorIDPrefix, rows);
    return contentBody;
};

const mapEditionSummary = (edition, editBaseURL) => {
    const contentBody = getBaseSummaryModel("edition-metadata");
    const rows = contentBody[0].groups[0].rows;
    const actionAnchorIDPrefix = "";
    const isPublished = edition?.state === "published";

    mapRow("Edition ID", edition.edition, false, !isPublished, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Edition title", edition.edition_title, false, true, editBaseURL, null, actionAnchorIDPrefix, rows);
    mapRow("Release date", formatDate(edition.release_date), false, false, editBaseURL, null, actionAnchorIDPrefix, rows);
    return contentBody;
};

const mapUploadedFiles = (files, actionOnClick) => {
    const contentBody = getBaseSummaryModel("uploaded-files-list");
    const rows = contentBody[0].groups[0].rows;
    files.forEach(file => {
        mapRow(file.title, " ", false, true, null, actionOnClick, null, rows)
    });
    return contentBody;
}

export { mapSeriesSummary, mapEditionSummary, mapUploadedFiles };
