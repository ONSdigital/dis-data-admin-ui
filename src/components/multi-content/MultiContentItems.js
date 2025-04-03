'use client';

import { useState } from 'react';

import { Button } from "author-design-system-react";
import MultiContentFieldsInput from './MultiContentFieldsInput';
import MultiContentFieldsSelect from './MultiContentFieldsSelect';

export default function MultiContentItems(props) {
    const [itemsNumber, setItemsNumber] = useState(props.contentItems?.length ? props.contentItems?.length : 1);

    const renderItemFields = () => {
        const items =[];
        for (let i = 0; i < itemsNumber; i++) {
            switch (props.fieldType) {
                case "input":
                    items.push(<MultiContentFieldsInput key={i} field={props.contentItems?.length ? props.contentItems[i] : null} id={props.id} index={i}/>);
                    break;
                case "select":
                    items.push(<MultiContentFieldsSelect key={i} field={props.contentItems?.length ? props.contentItems[i] : null} id={props.id} index={i}/>);
                    break;
                default:
                    console.warn("No 'fieldType' prop given");
            }
        }
        return <>{items}</>;
    };

    return (
        <>
            {renderItemFields()}
            <Button
                dataTestId={`${props.id}-add-button`}
                id={`${props.id}-add-button`}
                text={props.buttonLabel}
                variants={[
                    "secondary",
                    "small"
                ]}
                onClick={() => {
                    setItemsNumber(itemsNumber + 1);
                }}
                />
        </>
    );
}
