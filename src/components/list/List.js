import Link from "next/link";

export default function List({ items, type, noResultsText = "No results" }) {
    if (!items || items.length === 0) {
        return (
            <p>{noResultsText}</p>
        );
    }
    
    return (
        <ul className="ons-document-list">
            {items.map((item, index) => (
                <li key={item.id} className="ons-document-list__item ons-u-pb-s">
                    <div className="ons-document-list__item-content">
                        <div className="ons-document-list__item-header">
                            <h2 className="ons-document-list__item-title ons-u-fs-m ons-u-mt-no ons-u-mb-2xs" data-testid={`list-item-${index}-link`}>
                                <Link href={`${item.url}`}>{item.title}</Link>
                            </h2>
                            <ul className="ons-document-list__item-metadata ons-u-mb-2xs">
                                { type == "series"  ?
                                <>
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b" data-testid={`list-item-${index}-id`}>Series ID: </span>{item.id}
                                    </li>
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b" data-testid={`list-item-${index}-typw`}>Type: </span>{item.type}
                                    </li>
                                </>
                                    : null
                                }
                                { item.release_date ? 
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b" data-testid={`list-item-${index}-state`}>Released: </span>{item.release_date}
                                    </li>
                                    : null
                                }
                                { item.state ? 
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b" data-testid={`list-item-${index}-state`}>State: </span>{item.state}
                                    </li>
                                    : null
                                }
                            </ul>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
