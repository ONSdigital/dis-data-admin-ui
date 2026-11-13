"use client";

import { TextInput, Field } from "author-design-system-react";

export default function MultiContentFieldsContact({ id, index, item, handleOnChange, handleOnRemove, showRemoveButton, errors }) {
    const nameInputID = id + "-name-" + index;
    const emailInputID = id + "-email-" + index;
    const telephoneInputID = id + "-telephone-" + index;

    return (
        <div className="ons-u-mb-s ons-u-bb">
            <Field dataTestId="field-dataset-series-contacts" error={errors?.contacts ? {id:"dataset-series-contacts-error", text: errors.contacts} : null} >
            <input id={id} name={id} type="hidden" value={JSON.stringify({name: item.name, email: item.email, telephone: item.telephone })} />
            <div className="ons-grid ons-u-mb-s">
                <div className="ons-grid__col ons-col-4@m">
                    <TextInput
                        id={nameInputID}
                        dataTestId={nameInputID}
                        name={nameInputID}
                        classes="ons-input--block"
                        label={{
                            text: "Name",
                        }}
                        value={item.name}
                        error={errors?.[nameInputID] ? { id: `${nameInputID}-error`, text: errors[nameInputID] } : null}
                        onChange={e => handleOnChange({ ...item, name: e.target.value })}
                    />
                </div>
                <div className="ons-grid__col ons-col-4@m">
                    <TextInput
                        id={emailInputID}
                        dataTestId={emailInputID}
                        name={emailInputID}
                        classes="ons-input--block"
                        label={{
                            text: "Email",
                        }}
                        value={item.email}
                        error={errors?.[emailInputID] ? { id: `${emailInputID}-error`, text: errors[emailInputID] } : null}
                        onChange={e => handleOnChange({ ...item, email: e.target.value })}
                    />
                </div>
                <div className="ons-grid__col ons-col-4@m">
                    <TextInput
                        id={telephoneInputID}
                        dataTestId={telephoneInputID}
                        name={telephoneInputID}
                        classes="ons-input--block"
                        label={{
                            text: "Telephone (optional)",
                        }}
                        value={item.telephone}
                        onChange={e => handleOnChange({ ...item, telephone: e.target.value })}
                    />
                </div>
            </div>
            </Field>
            <div className="ons-u-mb-s">
                    <a
                        href="#"
                        onClick={(event) => {
                            event.preventDefault(); 
                            showRemoveButton ? handleOnRemove() : handleOnChange({ index, name: "", email: "", telephone: "" });
                        }}
                    >
                        { showRemoveButton ? "Remove" : "Clear"} contact
                    </a>
                </div>
        </div>
    );
};
