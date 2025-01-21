export  function mapListItems(items, datasetID) {
    return items.map(item => {
        return {
            id: item.edition,
            url: `/datasets/${datasetID}/editions/${item.edition}`,
            title: item.edition
        };
    });
};
