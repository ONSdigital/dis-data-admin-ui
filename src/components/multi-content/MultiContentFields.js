'use client';

import { useState } from 'react';

import { TextInput } from "author-design-system-react";
import TextArea from '../textarea/Textarea';

export default function MultiContentFields(props) {
    const [contentTitle, setContentTitle] = useState(props.field?.title || "");
    const [contentBody, setContentBody] = useState(props.field?.note || "");

    const inputID = props.id + "Input" + props.index;
    const textareaID = props.id + "TextArea" + props.index;

    return (
        <>
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
                onChange={e => setContentTitle(e.target.value)}
                key={inputID}
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
