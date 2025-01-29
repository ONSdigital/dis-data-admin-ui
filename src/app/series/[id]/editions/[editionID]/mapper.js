export  function mapListItems(items, datasetID, editionID) {
    return items.map((item, index) => {
        return {
            id: index + 1,
            url: `/series/${datasetID}/editions/${editionID}/versions/${index + 1}`,
            title: `Version: ${index + 1}`
        };
    });
};
