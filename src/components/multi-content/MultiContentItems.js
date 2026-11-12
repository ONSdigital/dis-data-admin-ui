"use client";

import { useState } from "react";

import { Button } from "author-design-system-react";
import MultiContentFieldsUsageNotes from "./MultiContentFieldsUsageNotes";
import MultiContentFieldsAlerts from "./MultiContentFieldsAlerts";
import MultiContentFieldsRelatedContent from "./MultiContentFieldsRelatedContent";
import MultiContentFieldsContact from "./MultiContentFieldsContact";

const blankItem = (fieldType) => {
    switch (fieldType) {
        case "usage-notes":
            return { title: "", note: "" };
        case "alerts":
            return { type: "", note: "" };
        case "related-content":
            return { title: "", href: "", description: "" };
        case "contact":
            return { name: "", email: "", telephone: "" };
        default:
            return {};
    }
};

export default function MultiContentItems({ fieldType, id="multi-content", contentItems, errors, buttonLabel }) {
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
                case "usage-notes":
                    renderedItems.push(<MultiContentFieldsUsageNotes
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
                case "alerts":
                    renderedItems.push(<MultiContentFieldsAlerts 
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
                case "related-content":
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
                case "contact":
                    renderedItems.push(<MultiContentFieldsContact 
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
        <div>
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
        </div>
    );
}
