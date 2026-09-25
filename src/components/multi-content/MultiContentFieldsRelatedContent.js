"use client";

import { useState, useEffect, useRef } from "react";

import { TextInput } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsRelatedContent({ id, index, field, onFieldsHaveContent }) {
    const [contentTitle, setContentTitle] = useState(field?.title || "");
    const [contentURL, setContentURL] = useState(field?.url || "");
    const [contentDescription, setContentDescription] = useState(field?.description || "");

    const titleInputID = id + "-title-" + index;
    const urlInputID = id + "-url-" + index;
    const textareaID = id + "-description-" + index;

    const fieldsHaveContent = contentTitle.length > 0 && contentURL.length > 0;

    // Store latest onFieldsHaveContent in a ref so we can call it from effects without
    // adding it to the dependency array (which could trigger an update loop)
    const onFieldsHaveContentRef = useRef(onFieldsHaveContent);
    useEffect(() => {
        onFieldsHaveContentRef.current = onFieldsHaveContent;
    }, [onFieldsHaveContent]);

    useEffect(() => {
        onFieldsHaveContentRef.current(fieldsHaveContent);
    }, [fieldsHaveContent]);

    const handleInputChange = (setState, value) => {
        setState(value);
    };

    return (
        <div className="ons-u-mb-m">
            <input id={id} name={id} type="hidden" value={JSON.stringify({title: contentTitle, url: contentURL, description: contentDescription})} />
            <TextInput
                id={titleInputID}
                dataTestId={titleInputID}
                name={titleInputID}
                classes="ons-input--block ons-input-number--w-50"
                label={{
                    text: "Title",
                }}
                value={contentTitle}
                onChange={e => handleInputChange(setContentTitle, e.target.value)}
                key={titleInputID}
            />
            <TextInput
                id={urlInputID}
                dataTestId={urlInputID}
                name={urlInputID}
                classes="ons-input--block ons-input-number--w-50"
                label={{
                    text: "URL",
                }}
                value={contentURL}
                onChange={e => handleInputChange(setContentURL, e.target.value)}
                key={urlInputID}
            />
            <TextArea 
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{text: "Description (optional)"}} 
                value={contentDescription} 
                key={textareaID} 
                fieldClasses={"ons-u-dib"}
                onChange={e => handleInputChange(setContentDescription, e.target.value)}
            />
        </div>
    );
};
