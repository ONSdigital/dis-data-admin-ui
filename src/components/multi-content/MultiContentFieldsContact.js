"use client";

import { TextInput } from "author-design-system-react";

export default function MultiContentFieldsContact({ id, index, item, handleOnChange, handleOnRemove, showRemoveButton, errors }) {
    const nameInputID = id + "-name-" + index;
    const emailInputID = id + "-email-" + index;
    const telephoneInputID = id + "-telephone-" + index;

    return (
        <div className="ons-u-mb-s ons-u-bb">
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
                        error={ errors?.name ? {id:"contact-name-error", text: errors.name} : null}
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
                        error={ errors?.email ? {id:"contact-email-error", text: errors.email} : null}
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
                            text: "Phone number (optional)",
                        }}
                        value={item.telephone}
                        onChange={e => handleOnChange({ ...item, telephone: e.target.value })}
                    />
                </div>
            </div>
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
