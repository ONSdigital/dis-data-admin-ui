[
  {
    "url": "#0",
    "text": "Home",
    "dataTestId": "home-link"
  },
  {
    "url": "#0",
    "text": "Components",
    "dataTestId": "components-link"
  }
]

const baseURL = "/data-admin/series";

const firstBreadcrumb = {
    url: baseURL,
    text: "Dataset catalogue",
    dataTestId: "breadcrumb-catalogue"
}

const generateBreadcrumb = (currentURL, datasetTitle, editionTitle) => {
    const urlSplit = currentURL.split("/")
    const breadcrumbs = [ firstBreadcrumb ]

    console.log("0:", urlSplit[0])
    console.log("1:", urlSplit[1])
    console.log("2:", urlSplit[2])
    console.log("3:", urlSplit[3])
    console.log("4:", urlSplit[4])
    console.log("5:", urlSplit[5])
    console.log("6:", urlSplit[6])
    console.log("7:", urlSplit[7])
    

    // add dataset series
    if (urlSplit.length >= 3) {
        breadcrumbs.push({
            url: `${baseURL}/${urlSplit[2]}`,
            text: datasetTitle || urlSplit[2],
            dataTestId: "breadcrumb-series"
        });
    }
    
    // add dataset edition
    if (urlSplit.length >= 5) {
        breadcrumbs.push({
            url: `${baseURL}/${urlSplit[2]}/editions/${urlSplit[4]}`,
            text: editionTitle || urlSplit[4],
            dataTestId: "breadcrumb-edition"
        });
    }

    // add dataset version
    if (urlSplit.length >= 7) {
        breadcrumbs.push({
            url: `${baseURL}/${urlSplit[2]}/editions/${urlSplit[4]}/versions/${urlSplit[6]}`,
            text: urlSplit[6],
            dataTestId: "breadcrumb-version"
        });
    }
    return breadcrumbs;
}

export { generateBreadcrumb }