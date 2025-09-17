// map content to design system <Summary> component

import slugify from "slugify";

import { formatDate } from "@/utils/datetime/datetime";

const getBaseSummaryModel = (groupID) => {
    return [{
        groups: [{   
            id: groupID || "group",
            rows: []
        }]
    }];
}

const mapRow = (itemName, value, multiValue, hasAction, actionURL, rows) => {
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
                url: `${actionURL}#dataset-series-${slugifyLowerCase(itemName)}`
            }
        ];
    }
    rows.push(item);
};

const mapSeriesSummary = (data, editBaseURL, topicTitles) => {
    const contentBody = getBaseSummaryModel("series-metadata");
    const rows = contentBody[0].groups[0].rows;

    mapRow("Series ID", data.id, false, false, editBaseURL, rows);
    mapRow("Type", data.type, false, false, editBaseURL, rows);
    mapRow("Title", data.title, false, true, editBaseURL, rows);
    mapRow("Description", data.description, false, true, editBaseURL, rows);

    if (topicTitles && topicTitles.length > 0) {
        mapRow("Topics", topicTitles, true, true, editBaseURL, rows);
    }

    mapRow("Last updated", formatDate(data.last_updated), false, false, editBaseURL, rows);
    mapRow("Licence", data.license, false, false, editBaseURL, rows);
    mapRow("Next release", data.next_release, false, false, editBaseURL, rows);

    if (data.keywords && data.keywords.length > 0) {
        mapRow("Keywords", data.keywords, true, true, editBaseURL, rows);
    }

    mapRow("QMI", data.qmi?.href, false, true, editBaseURL, rows);
    return contentBody;
};

const mapEditionSummary = (edition, editBaseURL) => {
    const contentBody = getBaseSummaryModel("edition-metadata");
    const rows = contentBody[0].groups[0].rows;

    mapRow("Edition ID", edition.edition, false, true, editBaseURL, rows);
    mapRow("Edition title", edition.edition_title, false, true, editBaseURL, rows);
    mapRow("Release date", formatDate(edition.release_date), false, false, editBaseURL, rows);
    return contentBody;
};

export { mapSeriesSummary, mapEditionSummary };
