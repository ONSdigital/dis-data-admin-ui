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
const mapRow = (itemName, value, multiValue, action, rows) => {
    const slugifyLowerCase = (string) => {
        if (!string) return "no-value";
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

const mapMigrationJobSummary = (tasks) => {
    const contentBody = getBaseSummaryModel("migration-job-list");
    const rows = contentBody[0].groups[0].rows;
    tasks.forEach(task => {
        switch(task.type) {
            case "dataset_series":
                mapRow("Series", task.target.id ,null, null, rows)
                break;
            case "dataset_edition":
                mapRow("Edition", task.target.id ,null, null, rows)
                break;
            case "dataset_version":
                mapRow("Version", task.target.id ,null, null, rows)
                break;
        }
    })
    return contentBody;
}

export { mapSeriesSummary, mapEditionSummary, mapUploadedFilesSummary, mapMigrationJobSummary };
