"use client";

import { useState, useEffect, useRef } from "react";

import { TextInput } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsRelatedContent({ id, index, item, handleOnChange, handleOnRemove, errors }) {
    const titleInputID = id + "-title-" + index;
    const urlInputID = id + "-url-" + index;
    const textareaID = id + "-description-" + index;

    return (
        <div className="ons-u-mb-m">
            <input id={id} name={id} type="hidden" value={JSON.stringify({title: item.title, href: item.href, description: item.description})} />
            <TextInput
                id={titleInputID}
                dataTestId={titleInputID}
                name={titleInputID}
                classes="ons-input--block ons-input-number--w-50"
                label={{
                    text: "Title",
                }}
                error={errors?.[titleInputID] ? { id: `${titleInputID}-error`, text: errors[titleInputID] } : null}
                value={item.title}
                onChange={e => handleOnChange({ ...item, title: e.target.value })}
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
                error={errors?.[urlInputID] ? { id: `${urlInputID}-error`, text: errors[urlInputID] } : null}
                value={item.href}
                onChange={e => handleOnChange({ ...item, href: e.target.value })}
                key={urlInputID}
            />
            <TextArea 
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{text: "Description (optional)"}} 
                value={item.description} 
                key={textareaID} 
                fieldClasses={"ons-u-dib"}
                onChange={e => handleOnChange({ ...item, description: e.target.value })}
            />
        </div>
    );
};
