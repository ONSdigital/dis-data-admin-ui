import { formatDate } from "@/utils/datetime/datetime";

const mapStateToUserFriendlyString = (state) => {
    switch (state) {
        case "associated":
            return "Draft";
        case "approved":
            return "Ready to publish";
        case "published":
            return "Published";
        default:
            return "Unable to get state";
    }
};

const mapListItems = (items, datasetID, editionID) => {
    return items.map((item, index) => {
        return {
            id: index + 1,
            url: `/series/${datasetID}/editions/${editionID}/versions/${index + 1}`,
            title: `Version: ${index + 1}`,
            state: mapStateToUserFriendlyString(item.state), 
            release_date: formatDate(item.release_date),
        };
    });
};

export { mapListItems, mapStateToUserFriendlyString };
