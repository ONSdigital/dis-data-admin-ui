import { NAVIGATION_OPTIONS } from "@/components/layout/layoutSetup";

const SERIES_ID_URL_INDEX = 3;
const EDITION_ID_URL_INDEX = 5;
const VERSION_ID_URL_INDEX = 7;

const getBaseBreadcrumb = (url) => {
    // remove home option as this won't ever be a base breadcrumb
    const navigationOptions = NAVIGATION_OPTIONS.slice(1);
    
    const base = navigationOptions.find((option) => url.includes(option.url));
    return {
        ...base,
        dataTestId: "breadcrumb-base"
    };
};

const generateBreadcrumb = (currentURL, datasetTitle, editionTitle) => {
    const baseBreadcrumb = getBaseBreadcrumb("/data-admin/series/test-dataset/editions/test-edition/versions/1");
    const breadcrumbs = [baseBreadcrumb];
    const urlSplit = currentURL.split("/");

    // add dataset series
    if (urlSplit.length >= 5) {
        breadcrumbs.push({
            url: `${baseBreadcrumb.url}/${urlSplit[SERIES_ID_URL_INDEX]}`,
            text: datasetTitle || urlSplit[SERIES_ID_URL_INDEX],
            dataTestId: "breadcrumb-series"
        });
    }
    
    // add dataset edition
    if (urlSplit.length >= 7) {
        breadcrumbs.push({
            url: `${baseBreadcrumb.url}/${urlSplit[SERIES_ID_URL_INDEX]}/editions/${urlSplit[EDITION_ID_URL_INDEX]}`,
            text: editionTitle || urlSplit[EDITION_ID_URL_INDEX],
            dataTestId: "breadcrumb-edition"
        });
    }

    // add dataset version
    if (urlSplit.length >= 9) {
        breadcrumbs.push({
            url: `${baseBreadcrumb.url}/${urlSplit[SERIES_ID_URL_INDEX]}/editions/${urlSplit[EDITION_ID_URL_INDEX]}/versions/${urlSplit[VERSION_ID_URL_INDEX]}`,
            text: urlSplit[VERSION_ID_URL_INDEX],
            dataTestId: "breadcrumb-version"
        });
    }
    return breadcrumbs;
};

export { generateBreadcrumb };