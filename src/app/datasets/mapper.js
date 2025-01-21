export  function mapListItems(items) {
    return items.map(item => {
        return {
            id: item.id,
            url: "/datasets/" + item.id,
            title: item.title
        };
    });
};
