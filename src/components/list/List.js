import Link from "next/link";

export default function List({ items, noResultsText = "No results" }) {
    if (!items || items.length === 0) {
        return (
            <p>{noResultsText}</p>
        );
    }
    
    return (
        <ul className="ons-document-list">
            {items.map((item, index) => (
                <li key={item.id} className="ons-document-list__item">
                    <div className="ons-document-list__item-content">
                        <div className="ons-document-list__item-header">
                            <h2 className="ons-document-list__item-title ons-u-fs-m ons-u-mt-no ons-u-mb-2xs" data-testid={`list-item-${index}-link`}>
                                <Link href={`${item.url}`}>{item.title}</Link>
                            </h2>
                            <ul className="ons-document-list__item-metadata ons-u-mb-2xs">
                                <li className="ons-document-list__item-attribute">
                                    <span className="ons-u-fw-b" data-testid={`list-item-${index}-id`}>ID: </span>{item.id}
                                </li>
                                { item.state ? 
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b" data-testid={`list-item-${index}-state`}>State: </span>{item.state}
                                    </li>
                                    : null
                                }
                            </ul>
                        </div>
                            { item.description ?
                                <div className="ons-document-list__item-description">
                                    <p data-testid={`list-item-${index}-description`}>{ item.description }</p>
                                </div>  : null
                            }
                    </div>
                </li>
            ))}
        </ul>
    );
}
