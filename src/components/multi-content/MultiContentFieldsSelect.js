"use client";

import { useState } from "react";

import { Select } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsSelect(props) {
    const [contentType, setContentType] = useState(props.field?.type || "");
    const [contentBody, setContentBody] = useState(props.field?.note || props.field?.description || "");

    const selectID = props.id + "-select-" + props.index;
    const textareaID = props.id + "-textarea-" + props.index;

    const handleInputChange = (setState, value) => {
        setState(value);
        props.onChange(contentType.length > 0 && contentBody.length > 0);
    };

    return (
        <div className="ons-u-mb-m">
            <input id={props.id} name={props.id} data-testid={props.id} type="hidden" value={JSON.stringify({type: contentType, description: contentBody})} />
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
