"use client";

import { useState, useEffect, useRef } from "react";

import { Radios } from "author-design-system-react";
import TextArea from "../textarea/Textarea";

export default function MultiContentFieldsRadios({ id, index, field, onFieldsHaveContent, showTypeOptions }) {
    // set to "alert" as default option when showTypeOptions is false because we assume we are in 
    // create mode and only alerts (not corrections) can be set when creating
    const [contentType, setContentType] = useState(field?.type || !showTypeOptions ? "alert" : "");
    const [contentBody, setContentBody] = useState(field?.note || field?.description || "");

    const radiosID = id + "-radios-" + index;
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

    const isChecked = (fieldValue) => {
        if (fieldValue === contentType) { return true; }
        return false;
    };

    const renderRadioOptions = () => {
        if (!showTypeOptions) return;

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
                            onChange: e => setContentType(e.target.value),
                            checked: isChecked("correction")
                        },
                        {
                            id: `${radiosID}-notice`,
                            label: {
                                text: "Notice"
                            },
                            value: "alert",
                            onChange: e => setContentType(e.target.value),
                            checked: isChecked("alert")
                        }
                    ]
                }}
            />
        );
    };

    return (
        <div className="ons-u-mb-m">
            <input id={id} name={id} data-testid={id} type="hidden" value={JSON.stringify({ type: contentType, description: contentBody })} />
            { renderRadioOptions() }
            <TextArea
                id={textareaID}
                dataTestId={textareaID}
                name={textareaID}
                label={{ text: "Description" }}
                value={contentBody}
                key={textareaID}
                fieldClasses={"ons-u-dib"}
                onChange={e => handleInputChange(setContentBody, e.target.value)}
            />
        </div>
    );
};
