import Link from 'next/link'

export default function List({ items }) {
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
                                <h2><Link href={`${item.url}`}>{item.title}</Link></h2>
                                <ul className="ons-document-list__item-metadata ons-u-mb-1xs">
                                    <li className="ons-document-list__item-attribute">
                                        <span className="ons-u-fw-b">ID: </span>{item.id}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )
    }
}
