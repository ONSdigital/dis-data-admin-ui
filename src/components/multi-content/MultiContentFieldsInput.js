"use client";

import { useState, useEffect, useRef } from "react";

import { TextInput } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsInput({ id, index, item, handleOnChange, handleOnRemove, showRemoveButton }) {
    const inputID = `${id}-input-${index}`;
    const textareaID = `${id}-textarea-${index}`;

    return (
        <div className="ons-u-mb-m">
            <input id={id} name={id} type="hidden" value={JSON.stringify(item)} />
            <TextInput
                id={inputID}
                dataTestId={inputID}
                name={inputID}
                classes="ons-input--block ons-input-number--w-50"
                label={{ text: "Note title" }}
                value={item.title}
                onChange={(event) => handleOnChange({ ...item, title: event.target.value })}
            />
            <TextArea
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{ text: "Description" }}
                value={item.note}
                fieldClasses="ons-u-dib"
                onChange={(event) => handleOnChange({ ...item, note: event.target.value })}
            />
            {showRemoveButton && (
                <div>
                    <a
                        href="#"
                        onClick={(event) => {event.preventDefault(); handleOnRemove();}}
                    >
                        Remove usage note
                    </a>
                </div>
            )}
        </div>
    );
}
