import slugify from "slugify";

import { mapStateToUserFriendlyString } from "./editions/[editionID]/mapper";
import { formatDate } from "@/utils/datetime/datetime";

const mapListItems = (items, datasetID) => {
    return items.map(listItem => {
        const item = listItem?.current || listItem?.next || listItem;
        return {
            id: item.edition,
            url: `/series/${datasetID}/editions/${item.edition}`,
            title: item.edition_title,
            state: mapStateToUserFriendlyString(item.state)
        };
    });
};

// map content to design system <Summary> component
const mapContentItems = (data, editBaseURL, topicTitles) => {
    const rows = [];

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
    
    const mapRow = (itemName, value, multiValue, hasAction) => {
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
                    url: `${editBaseURL}#dataset-series-${slugifyLowerCase(itemName)}`
                }
            ];
        }
        rows.push(item);
    };

    mapRow("Series ID", data.id, false, false);
    mapRow("Type", data.type, false, false);
    mapRow("Title", data.title, false, true);
    mapRow("Description", data.description, false, true);

    if (topicTitles && topicTitles.length > 0) {
        mapRow("Topics", topicTitles, true, true);
    }

    mapRow("Last updated", formatDate(data.last_updated), false, false);
    mapRow("Licence", data.license, false, false);
    mapRow("Next release", data.next_release, false, false);

    if (data.keywords && data.keywords.length > 0) {
        mapRow("Keywords", data.keywords, true, true);
    }

    mapRow("QMI", data.qmi?.href, false, true);

    const contentBody = [{
        groups: [{   
            id: "series-metadata",
            rows: rows
        }]
    }];
    return contentBody;
};

export { mapListItems, mapContentItems };
