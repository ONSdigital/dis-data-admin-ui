"use client";

import { useState } from "react";

import { TextInput } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsInput(props) {
    const [contentTitle, setContentTitle] = useState(props.field?.title || "");
    const [contentBody, setContentBody] = useState(props.field?.note || "");

    const inputID = props.id + "-input-" + props.index;
    const textareaID = props.id + "-textarea-" + props.index;

    const handleInputChange = (setState, value) => {
        setState(value);
        props.onChange(contentTitle.length > 0 && contentBody.length > 0);
    };

    return (
        <div className="ons-u-mb-m">
            <input id={props.id} name={props.id} type="hidden" value={JSON.stringify({title: contentTitle, note: contentBody})} />
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
