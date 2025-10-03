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
const mapRow = (itemName, value, multiValue, hasAction, actionURL, actionAnchorIDPrefix, rows) => {
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
                url: `${actionURL}#${actionAnchorIDPrefix}${slugifyLowerCase(itemName)}`
            }
        ];
    }
    rows.push(item);
};

const mapSeriesSummary = (data, editBaseURL, topicTitles, contacts) => {
    const contentBody = getBaseSummaryModel("series-metadata");
    const rows = contentBody[0].groups[0].rows;
    const actionAnchorIDPrefix = "dataset-series-";

    mapRow("Series ID", data.id, false, false, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Type", data.type, false, false, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Title", data.title, false, true, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Description", data.description, false, true, editBaseURL, actionAnchorIDPrefix, rows);

    if (topicTitles && topicTitles.length > 0) {
        mapRow("Topics", topicTitles, true, true, editBaseURL, actionAnchorIDPrefix, rows);
    }

    mapRow("Last updated", formatDate(data.last_updated), false, false, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Licence", data.license, false, false, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Next release", data.next_release, false, false, editBaseURL, actionAnchorIDPrefix, rows);

    if (data.keywords && data.keywords.length > 0) {
        mapRow("Keywords", data.keywords, true, true, editBaseURL, actionAnchorIDPrefix, rows);
    }

    mapRow("QMI", data.qmi?.href, false, true, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Publisher", data.publisher.name, false, false, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Contacts", contacts, true, true, editBaseURL, actionAnchorIDPrefix, rows);

    return contentBody;
};

const mapEditionSummary = (edition, editBaseURL) => {
    const contentBody = getBaseSummaryModel("edition-metadata");
    const rows = contentBody[0].groups[0].rows;
    const actionAnchorIDPrefix = "";

    mapRow("Edition ID", edition.edition, false, true, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Edition title", edition.edition_title, false, true, editBaseURL, actionAnchorIDPrefix, rows);
    mapRow("Release date", formatDate(edition.release_date), false, false, editBaseURL, actionAnchorIDPrefix, rows);
    return contentBody;
};

export { mapSeriesSummary, mapEditionSummary };
