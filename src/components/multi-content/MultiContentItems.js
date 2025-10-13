"use client";

import { useState } from "react";

import { Button } from "author-design-system-react";
import MultiContentFieldsInput from "./MultiContentFieldsInput";
import MultiContentFieldsRadios from "./MultiContentFieldsRadios";

export default function MultiContentItems(props) {
    const [itemsNumber, setItemsNumber] = useState(props.contentItems?.length ? props.contentItems?.length : 1);
    const [buttonVariants, setButtonVariants] = useState(["disabled", "secondary", "small"]);

    const handleButtonStatus = (fieldsHaveContent) => {
        if (!fieldsHaveContent) {
            setButtonVariants([...buttonVariants, "disabled"]);
            return;
        }
        
        const updatedButtonVariants = buttonVariants.filter(buttonVariant => buttonVariant !== "disabled");
        setButtonVariants(updatedButtonVariants);
        return;
    };

    const renderItemFields = () => {
        const items =[];
        for (let i = 0; i < itemsNumber; i++) {
            switch (props.fieldType) {
                case "input":
                    items.push(<MultiContentFieldsInput key={i}
                        onFieldsHaveContent={handleButtonStatus}
                        id={props.id} 
                        index={i} 
                        field={props.contentItems?.length ? props.contentItems[i] : null} 
                    />);
                    break;
                case "radios":
                    items.push(<MultiContentFieldsRadios key={i} 
                        onFieldsHaveContent={handleButtonStatus}
                        showTypeOptions={props.contentItems?.length ? true : false}
                        id={props.id} 
                        index={i}
                        field={props.contentItems?.length ? props.contentItems[i] : null}
                    />);
                    break;
                default:
                    console.warn(`No "fieldType" prop given`);
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
                variants={buttonVariants}
                onClick={() => {
                    setItemsNumber(itemsNumber + 1);
                    setButtonVariants([...buttonVariants, "disabled"]);
                }}
                />
        </>
    );
}
