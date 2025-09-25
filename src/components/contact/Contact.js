"use client";

import { useState } from "react";
import isEmail from "validator/lib/isEmail";

import { TextInput, Field, Button } from "author-design-system-react";

export default function Contact({contacts, setContacts, contactsError}) {
    const [contactName, setContactName] = useState("");
    const [contactNameError, setContactNameError] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactEmailError, setContactEmailError] = useState("");

    console.log(contacts)

    const addContact = () => {
        if (!contactName.length && !contactEmail.length) {
            setContactNameError("Name is required");
            setContactEmailError("Email is required");
            return;
        }
        if (!contactName.length && isEmail(contactEmail)) {
            setContactNameError("Name is required");
            setContactEmailError("");
            return;
        }
        if (contactName.length && !isEmail(contactEmail)) {
            setContactNameError("");
            setContactEmailError("Email is invalid");
            return;
        }

        setContacts([
            ...contacts,
            { name: contactName, email: contactEmail }
        ]);

        setContactName("");
        setContactEmail("");
        setContactNameError("");
        setContactEmailError("");
    }

    const renderContactList = () => {
        if (!contacts?.length) {
            return;
        }

    return (
        <div className="ons-u-mt-l">
            <h3>Contacts</h3>
            <ul className="ons-document-list ons-u-mt-l ons-grid ons-grid--gutterless">
                {contacts.map((contact, index) => (
                    <li className="ons-u-pt-s ons-u-pb-s ons-u-bb ons-grid__col ons-col-8@m" data-testid={"contact-item-" + index} key={contact.email}>
                        <div className="ons-document-list__item-content">
                            <div className="ons-grid__col ons-col-3@m">
                                <span className="ons-u-fw">{contact.name}</span>
                            </div>
                            <div className="ons-grid__col ons-col-3@m ons-push-1@m">
                                <span className="ons-u-fw">{contact.email}</span>
                            </div>
                            <div className="ons-grid__col ons-col-2@m ons-push-5@m">
                                <p>
                                    <a
                                        data-testid={"dataset-remove-contact-" + index}
                                        id={"dataset-remove-contact-" + index}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setContacts(
                                                contacts.filter(c =>
                                                    c.email !== contact.email
                                                )
                                            );
                                        }}
                                    >
                                        Remove
                                    </a>
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
    };

    return (
        <>
            <Field dataTestId="field-dataset-series-contacts" error={contactsError ? {id:"dataset-series-contacts-error", text: contactsError} : null}>
                <h2>Add Contacts</h2>
                <TextInput
                    id="dataset-series-contact-name"
                    dataTestId="dataset-series-contact-name"
                    name="dataset-series-contact-name"
                    label={{
                        text: "Name",
                    }}
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    fieldClasses="ons-u-dib"
                    error={ contactNameError ? {id:"contact-name-error", text: contactNameError} : null}
                />
                <TextInput
                    id="dataset-series-contact-email"
                    dataTestId="dataset-series-contact-email"
                    name="dataset-series-contact-email"
                    label={{
                        text: "Email",
                    }}
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    error={ contactEmailError ? {id:"contact-email-error", text: contactEmailError} : null}
                    fieldClasses="ons-u-dib ons-u-ml-xs"
                />
                <Button
                    classes="ons-u-ml-xs ons-u-mt-m ons-u-pt-m"
                    dataTestId="dataset-series-add-contact-button"
                    id="dataset-series-add-contact-button"
                    text="Add contact"
                    variants={[
                        "small"
                    ]}
                    onClick={() => { addContact() }}
                />
                {renderContactList()}
                <input id="dataset-series-contacts" type="hidden" name="dataset-series-contacts" value={JSON.stringify(contacts)} />
            </Field>
        </>
    );
}
