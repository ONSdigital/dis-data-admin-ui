import Link from 'next/link';

export default function List({ items, noResultsText = "No results" }) {
    if (!items || items.length === 0) {
        return (
            <p>{noResultsText}</p>
        );
    } else {
        return (
            <ul className="ons-document-list">
                {items.map((item) => (
                    <li key={item.id} className="ons-document-list__item">
                        <div className="ons-document-list__item-content">
                            <div className="ons-document-list__item-header">
                                <h2 className="ons-document-list__item-title ons-u-fs-m ons-u-mt-no ons-u-mb-2xs"><Link href={`${item.url}`}>{item.title}</Link></h2>
                                <ul className="ons-document-list__item-metadata ons-u-mb-2xs">
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b">ID: </span>{item.id}
                                    </li>
                                </ul>
                            </div>
                                { item.description ?
                                    <div className="ons-document-list__item-description">
                                        <p>{ item.description }</p>
                                    </div>  : ''
                                }
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
}
