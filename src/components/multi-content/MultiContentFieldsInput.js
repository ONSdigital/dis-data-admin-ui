"use client";

import { useState, useEffect, useRef } from "react";

import { TextInput } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsInput({ id, index, field, onFieldsHaveContent }) {
    const [contentTitle, setContentTitle] = useState(field?.title || "");
    const [contentBody, setContentBody] = useState(field?.note || "");

    const inputID = id + "-input-" + index;
    const textareaID = id + "-textarea-" + index;

    const fieldsHaveContent = contentTitle.length > 0 && contentBody.length > 0;

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
            <input id={id} name={id} type="hidden" value={JSON.stringify({title: contentTitle, note: contentBody})} />
            <TextInput
                id={inputID}
                dataTestId={inputID}
                name={inputID}
                label={{
                    text: "Title",
                    description: `Usage note title e.g. "Information on using this data"`,
                }}
                value={contentTitle}
                onChange={e => handleInputChange(setContentTitle, e.target.value)}
                key={inputID}
            />

            <TextArea 
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{text: "Description"}} 
                value={contentBody} 
                key={textareaID} 
                onChange={e => handleInputChange(setContentBody, e.target.value)}
            />
        </div>
    );
};
