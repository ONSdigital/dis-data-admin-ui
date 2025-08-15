export  function mapListItems(items) {
    return items.map(listItem => {
        const item = listItem?.next || listItem?.current || listItem;
        return {
            id: item.id,
            url: "/series/" + item.id,
            title: item.title,
            description: item.description,
            type: item.type
        };
    });
}
