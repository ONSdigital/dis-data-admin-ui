"use client";

import { useState, useEffect, useRef } from "react";

import { Select } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsSelect({ id, index, field, onFieldsHaveContent }) {
    const [contentType, setContentType] = useState(field?.type || "");
    const [contentBody, setContentBody] = useState(field?.note || field?.description || "");

    const selectID = id + "-select-" + index;
    const textareaID = id + "-textarea-" + index;

    const fieldsHaveContent = contentType.length > 0 && contentBody.length > 0;
    
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
            <input id={id} name={id} data-testid={id} type="hidden" value={JSON.stringify({type: contentType, description: contentBody})} />
            <Select id={selectID} dataTestId={selectID} name={selectID} label={{text: "Type"}} onChange={e => handleInputChange(setContentType, e)} value={contentType}
                options={[
                    {
                        value:"",
                        text: "Select an option",
                        disabled: true
                    },
                    {
                        value:"correction",
                        text: "Correction",
                    },
                    {
                        value:"alert",
                        text: "Notice",
                    }
                ]}
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
