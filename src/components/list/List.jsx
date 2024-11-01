export default function Layout({ items }) {
    if (!items || items.length === 0) {
        return (
            <p>No results</p>
        )
    } else {
        return (
            <ul className="ons-document-list">
                {items.map((item) => (
                    <li key={item.id} className="ons-document-list__item">
                        <div className="ons-document-list__item-content">
                            <div className="ons-document-list__item-header">
                                <h2><a href={item.url}>{item.title}</a></h2>
                                <ul className="ons-document-list__item-metadata ons-u-mb-1xs">
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b">ID: </span>{item.id}
                                    </li>
                                    {/* <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b"></span>
                                    </li> */}
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }
}