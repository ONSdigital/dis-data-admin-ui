import { mapStateToUserFriendlyString } from "./editions/[editionID]/mapper";

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

export { mapListItems };
