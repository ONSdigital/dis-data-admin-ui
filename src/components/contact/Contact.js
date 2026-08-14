"use client";

import { useState } from "react";
import { isEmailValid } from "@hapi/address";

import { TextInput, Field, Button } from "author-design-system-react";

export default function Contact({contactsList, contactsError}) {
    const [contacts, setContacts] = useState(contactsList || []);
    const [contactName, setContactName] = useState("");
    const [contactNameError, setContactNameError] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactEmailError, setContactEmailError] = useState("");
    const [contactTelephone, setContactTelephone] = useState("");

    const addContact = () => {
        const name = contactName.trim();
        const email = contactEmail.trim();
        const telephone = contactTelephone.trim();
        const validationErrors = {};

        if (!name) validationErrors.name = "Name is required";
        if (!email) validationErrors.email = "Email is required";
        else if (!isEmailValid(email)) validationErrors.email = "Invalid email";

        setContactNameError(validationErrors.name || "");
        setContactEmailError(validationErrors.email || "");

        if (validationErrors.name || validationErrors.email) return;

        setContacts([...contacts, { name, email, telephone }]);
        setContactName("");
        setContactEmail("");
        setContactTelephone("");
    };

    const removeContact = (contact) => {
        setContacts(
            contacts.filter(c =>
                !(c.name === contact.name &&
                  c.email === contact.email &&
                  c.telephone === contact.telephone)
            )
        );
    };

    const renderContactList = () => {
        if (!contacts?.length) {
            return;
        }

        return (
            <div className="ons-u-mt-xl">
                <h3 className="ons-u-mb-xs" id="dataset-series-contacts">Contacts</h3>
                <ul className="ons-document-list ons-u-mt-xs ons-grid ons-grid--gutterless">
                    {contacts.map((contact, index) => (
                        <li className="ons-u-pt-s ons-u-pb-s ons-u-bb ons-grid__col ons-u-mb-no" data-testid={"contact-item-" + index} key={index}>
                            <div className="ons-document-list__item-content">
                                <div className="ons-grid__col ons-col-3@m">
                                    <span className="ons-u-fw">{contact.name}</span>
                                </div>
                                <div className="ons-grid__col ons-col-4@m">
                                    <span className="ons-u-fw">{contact.email}</span>
                                </div>
                                <div className="ons-grid__col ons-col-3@m">
                                    <span className="ons-u-fw">{contact.telephone}</span>
                                </div>
                                <div className="ons-grid__col ons-col-1@m ons-push-1@m">
                                    <a
                                        data-testid={"dataset-remove-contact-" + index}
                                        id={"dataset-remove-contact-" + index}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeContact(contact);
                                        }}
                                    >
                                        Remove
                                    </a>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <>
            <Field dataTestId="field-dataset-series-contacts" error={contactsError ? {id:"dataset-series-contacts-error", text: contactsError} : null} classes={["ons-u-mt-xl ons-u-mb-l"]}>
                <h2 className="ons-u-mb-no">Add Contacts</h2>
                <div className="ons-grid ons-u-mt-s">
                    <div className="ons-grid__col ons-col-4@m">
                        <TextInput
                            id="dataset-series-contact-name"
                            dataTestId="dataset-series-contact-name"
                            name="dataset-series-contact-name"
                            classes="ons-input--block"
                            label={{
                                text: "Name",
                            }}
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            error={ contactNameError ? {id:"contact-name-error", text: contactNameError} : null}
                        />
                    </div>
                    <div className="ons-grid__col ons-col-4@m">
                        <TextInput
                            id="dataset-series-contact-email"
                            dataTestId="dataset-series-contact-email"
                            name="dataset-series-contact-email"
                            classes="ons-input--block"
                            label={{
                                text: "Email",
                            }}
                            value={contactEmail}
                            onChange={e => setContactEmail(e.target.value)}
                            error={ contactEmailError ? {id:"contact-email-error", text: contactEmailError} : null}
                        />
                    </div>
                    <div className="ons-grid__col ons-col-4@m">
                        <TextInput
                            id="dataset-series-contact-telephone"
                            dataTestId="dataset-series-contact-telephone"
                            name="dataset-series-contact-telephone"
                            classes="ons-input--block"
                            label={{
                                text: "Phone number (optional)",
                            }}
                            value={contactTelephone}
                            onChange={e => setContactTelephone(e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    classes="ons-u-mt-m"
                    dataTestId="dataset-series-add-contact-button"
                    id="dataset-series-add-contact-button"
                    text="Add contact"
                    variants={[
                        "small",
                        "secondary"
                    ]}
                    onClick={() => { addContact(); }}
                />
                {renderContactList()}
                <input id="dataset-series-contacts" type="hidden" name="dataset-series-contacts" value={JSON.stringify(contacts)} />
            </Field>
        </>
    );
}
