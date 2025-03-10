'use client';

import { useState } from 'react';

import { Select } from "author-design-system-react";
import TextArea from '../textarea/Textarea';

export default function MultiContentFieldsSelect(props) {
    const [contentType, setContentType] = useState(props.field?.type || "");
    const [contentBody, setContentBody] = useState(props.field?.note || "");

    const selectID = props.id + "Select" + props.index;
    const textareaID = props.id + "TextArea" + props.index;

    return (
        <>
            <input id={props.id} name={props.id} type="hidden" value={JSON.stringify({type: contentType, note: contentBody})} />
            <Select id={selectID} dataTestId={selectID} name={selectID} label={{text: "Type"}} onChange={e => setContentType(e)}
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
                        value:"notice",
                        text: "Notice",
                    }
                ]}
            />

            <TextArea 
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{text: 'Note'}} 
                value={contentBody} 
                key={textareaID} 
                onChange={e => setContentBody(e.target.value)}
            />
        </>
    )
};
