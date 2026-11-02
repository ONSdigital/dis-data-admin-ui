"use client";

import { Radios } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsRadios({ id, index, item, handleOnChange, handleOnRemove }) {
    const radiosID = id + "-radios-" + index;
    const textareaID = id + "-textarea-" + index;

    const isChecked = (fieldValue) => {
        if (fieldValue === item.type) { return true; }
        return false;
    };

    const renderRadioOptions = () => {
        return (
            <Radios
                dataTestId={radiosID}
                legend="Alert type"
                name={radiosID}
                borderless={true}
                radios={{
                    radioList: [
                        {
                            id: `${radiosID}-correction`,
                            label: {
                                text: "Correction"
                            },
                            value: "correction",
                            onChange: e => handleOnChange({ ...item, type: e.target.value }),
                            checked: isChecked("correction")
                        },
                        {
                            id: `${radiosID}-notice`,
                            label: {
                                text: "Notice"
                            },
                            value: "alert",
                            onChange: e => handleOnChange({ ...item, type: e.target.value }),
                            checked: isChecked("alert")
                        }
                    ]
                }}
            />
        );
    };

    return (
        <div className="ons-u-mb-m">
            <input id={id} name={id} data-testid={id} type="hidden" value={JSON.stringify({ type: item.type, description: item.note })} />
            { renderRadioOptions() }
            <TextArea
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{ text: "Description" }}
                value={item.note}
                key={textareaID}
                fieldClasses={"ons-u-dib"}
                onChange={(event) => handleOnChange({ ...item, note: event.target.value })}
            />
            <div>
                <a
                    href="#"
                    onClick={(event) => {event.preventDefault(); handleOnRemove();}}
                >
                    Remove usage note
                </a>
            </div>
        </div>
    );
};
