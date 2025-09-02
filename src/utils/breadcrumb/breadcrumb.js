const baseURL = "/data-admin/series";

const firstBreadcrumb = {
    url: baseURL,
    text: "Dataset catalogue",
    dataTestId: "breadcrumb-catalogue"
};

const generateBreadcrumb = (currentURL, datasetTitle, editionTitle) => {
    const urlSplit = currentURL.split("/")
    const breadcrumbs = [ firstBreadcrumb ]

    // add dataset series
    if (urlSplit.length >= 4) {
        breadcrumbs.push({
            url: `${baseURL}/${urlSplit[2]}`,
            text: datasetTitle || urlSplit[2],
            dataTestId: "breadcrumb-series"
        });
    }
    
    // add dataset edition
    if (urlSplit.length >= 6) {
        breadcrumbs.push({
            url: `${baseURL}/${urlSplit[2]}/editions/${urlSplit[4]}`,
            text: editionTitle || urlSplit[4],
            dataTestId: "breadcrumb-edition"
        });
    }

    // add dataset version
    if (urlSplit.length >= 8) {
        breadcrumbs.push({
            url: `${baseURL}/${urlSplit[2]}/editions/${urlSplit[4]}/versions/${urlSplit[6]}`,
            text: urlSplit[6],
            dataTestId: "breadcrumb-version"
        });
    }
    return breadcrumbs;
}

export { generateBreadcrumb }