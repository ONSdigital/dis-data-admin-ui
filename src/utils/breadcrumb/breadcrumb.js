const BASE_URL = "/data-admin/series";

const BASE_BREADCRUMB = {
    url: BASE_URL,
    text: "Dataset catalogue",
    dataTestId: "breadcrumb-catalogue"
};

const SERIES_ID_URL_INDEX = 3;
const EDITION_ID_URL_INDEX = 5;
const VERSION_ID_URL_INDEX = 7;

const generateBreadcrumb = (currentURL, datasetTitle, editionTitle) => {
    const urlSplit = currentURL.split("/");
    const breadcrumbs = [ BASE_BREADCRUMB ];

    // add dataset series
    if (urlSplit.length >= 5) {
        breadcrumbs.push({
            url: `${BASE_URL}/${urlSplit[SERIES_ID_URL_INDEX]}`,
            text: datasetTitle || urlSplit[SERIES_ID_URL_INDEX],
            dataTestId: "breadcrumb-series"
        });
    }
    
    // add dataset edition
    if (urlSplit.length >= 7) {
        breadcrumbs.push({
            url: `${BASE_URL}/${urlSplit[SERIES_ID_URL_INDEX]}/editions/${urlSplit[EDITION_ID_URL_INDEX]}`,
            text: editionTitle || urlSplit[EDITION_ID_URL_INDEX],
            dataTestId: "breadcrumb-edition"
        });
    }

    // add dataset version
    if (urlSplit.length >= 9) {
        breadcrumbs.push({
            url: `${BASE_URL}/${urlSplit[SERIES_ID_URL_INDEX]}/editions/${urlSplit[EDITION_ID_URL_INDEX]}/versions/${urlSplit[VERSION_ID_URL_INDEX]}`,
            text: urlSplit[VERSION_ID_URL_INDEX],
            dataTestId: "breadcrumb-version"
        });
    }
    return breadcrumbs;
};

export { generateBreadcrumb };