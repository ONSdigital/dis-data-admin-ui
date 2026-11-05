"use client";

import { TextInput } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsUsageNotes({ id, index, item, handleOnChange, handleOnRemove, showRemoveButton, errors }) {
    const inputID = `${id}-input-${index}`;
    const textareaID = `${id}-textarea-${index}`;

    return (
        <div className="ons-u-mb-s ons-u-bb">
            <input id={id} name={id} type="hidden" value={JSON.stringify(item)} />
            <TextInput
                id={inputID}
                dataTestId={inputID}
                name={inputID}
                classes="ons-input--block ons-input-number--w-50"
                label={{ text: "Note title" }}
                value={item.title}
                onChange={(event) => handleOnChange({ ...item, title: event.target.value })}
                error={errors?.[inputID] ? { id: `${inputID}-error`, text: errors[inputID] } : null}
            />
            <TextArea
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{ text: "Description" }}
                value={item.note}
                fieldClasses="ons-u-dib ons-u-mb-s"
                onChange={(event) => handleOnChange({ ...item, note: event.target.value })}
                error={errors?.[textareaID] ? { id: `${textareaID}-error`, text: errors[textareaID] } : null}
            />
            {showRemoveButton && (
                <div className="ons-u-mb-s">
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
