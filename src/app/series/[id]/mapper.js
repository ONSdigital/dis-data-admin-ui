export  function mapListItems(items, datasetID) {
    return items.map(item => {
        return {
            id: item.edition,
            url: `/series/${datasetID}/editions/${item.edition}`,
            title: item.edition
        }
    })
}