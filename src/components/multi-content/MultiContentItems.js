'use client';

import { useState } from 'react';

import { Button } from "author-design-system-react";
import MultiContentFields from './MultiContentFields';

export default function MultiContentItems({contentItems, id, setContacts, contactsError}) {
    const [itemsNumber, setItemsNumber] = useState(contentItems.length ? contentItems.length : 1)

    const renderItemFields = () => {
        const items =[];
        for (let i = 0; i < itemsNumber; i++) {
            items.push(<MultiContentFields key={i} field={contentItems[i]} id={id} index={i}/>);
        }
        return <>{items}</>
    };

    return (
        <>
            {renderItemFields()}
            <Button
                dataTestId="datasetSeriesAddContactButton"
                id="datasetSeriesAddContactButton"
                text="Add another usage note"
                variants={[
                    "secondary",
                    "small"
                ]}
                classes="ons-u-mt-s"
                onClick={() => {
                    setItemsNumber(itemsNumber + 1)
                }}
                />
        </>
    );
}
