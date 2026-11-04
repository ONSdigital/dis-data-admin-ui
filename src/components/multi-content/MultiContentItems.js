"use client";

import { useState } from "react";

import { Button } from "author-design-system-react";
import MultiContentFieldsInput from "./MultiContentFieldsInput";
import MultiContentFieldsRadios from "./MultiContentFieldsRadios";
import MultiContentFieldsRelatedContent from "./MultiContentFieldsRelatedContent";

const blankItem = (fieldType) => {
    switch (fieldType) {
        case "input":
            return { title: "", note: "" };
        case "radios":
            return { type: "", note: "" };
        case "relatedContent":
            return { title: "", href: "", description: "" };
        default:
            return {};
    }
};

export default function MultiContentItems({ fieldType, id="multi-content", contentItems, errors, buttonLabel}) {
    const [items, setItems] = useState(contentItems?.length ? contentItems : [blankItem(fieldType)]);

    const handleChange = (index, nextItem) => {
        setItems((current) => current.map((item, i) => (i === index ? nextItem : item)));
    };
    const handleRemove = (index) => {
        setItems((current) => current.filter((_, i) => i !== index));
    };
    const handleAddItem = () => {
        setItems((current) => [...current, blankItem(fieldType)]);
    };

    const renderItemFields = () => {
        const renderedItems = [];
        for (let i = 0; i < items.length; i++) {
            switch (fieldType) {
                case "input":
                    renderedItems.push(<MultiContentFieldsInput
                        key={i}
                        id={id}
                        index={i}
                        item={items[i]}
                        handleOnChange={(nextItem) => handleChange(i, nextItem)}
                        showRemoveButton={items.length > 1}  
                        handleOnRemove={() => handleRemove(i)}
                        errors={errors}
                    />);
                    break;
                case "radios":
                    renderedItems.push(<MultiContentFieldsRadios 
                        key={i}
                        id={id}
                        index={i}
                        item={items[i]}
                        handleOnChange={(nextItem) => handleChange(i, nextItem)}
                        showRemoveButton={items.length > 1}
                        handleOnRemove={() => handleRemove(i)}
                        errors={errors}
                    />);
                    break;
                case "relatedContent":
                    renderedItems.push(<MultiContentFieldsRelatedContent 
                        key={i}
                        id={id}
                        index={i}
                        item={items[i]}
                        handleOnChange={(nextItem) => handleChange(i, nextItem)}
                        showRemoveButton={items.length > 1}
                        handleOnRemove={() => handleRemove(i)}
                        errors={errors}
                    />);
                    break;
                default:
                    console.warn(`No "fieldType" prop given`);
            }
        }
        return <>{renderedItems}</>;
    };

    return (
        <>
            {renderItemFields()}
            <Button
                dataTestId={`${id}-add-button`}
                id={`${id}-add-button`}
                text={buttonLabel}
                variants={["secondary", "small"]}
                onClick={() => {
                    handleAddItem();
                }}
                />
        </>
    );
}
