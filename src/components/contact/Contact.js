'use client'

import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';

import { TextInput } from "author-design-system-react";
import { Button } from "author-design-system-react";
import { Field } from 'author-design-system-react';

export default function Contact({contacts, setContacts, contactsError}) {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactEmailError, setContactEmailError] = useState('');

    const renderContactList = () => {
        return (
            <>
            { contacts ?  
                <ul className="ons-document-list ons-u-mb-l">
                {contacts.map((contact) => (
                    <li key={contact.email}>
                        <div className="ons-document-list__item-content">
                            <div className='ons-container'>
                                <div className="ons-grid">
                                    <div className="ons-grid__col ons-col-3@m">
                                        <span className="ons-u-fw">{contact.name}</span>
                                    </div>
                                    <div className="ons-grid__col ons-col-3@m">
                                        <span className="ons-u-fw">{contact.email}</span>          
                                    </div>
                                    <div className="ons-grid__col ons-col-2@m">
                                        <Button
                                        dataTestId="dataset-series-remove-contact-button"
                                        id="dataset-series-remove-contact-button"
                                        text="Remove"
                                        variants={[
                                            'tertiary',
                                            'small'
                                        ]}
                                        onClick={() => {
                                            setContacts(
                                                contacts.filter(c =>
                                                    c.email !== contact.email
                                                )
                                            )
                                        }}
                                        />
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </li>
                ))}
                </ul> : ""}
            </>
        )
    }

    return (
        <>
            <Field dataTestId="field-dataset-series-contacts" error={contactsError ? {id:'dataset-series-contacts-error', text: contactsError} : undefined}>
            <h2>Contacts</h2>
                <input id="dataset-series-contacts" type="hidden" name="dataset-series-contacts" value={JSON.stringify(contacts)} />
                {renderContactList()}
                <div className='ons-container--wide'>
                    <div className="ons-grid ons-grid--spaced">                
                        <div className="ons-grid__col ons-col-5@m">
                            <TextInput
                            id="dataset-series-contact-name"
                            dataTestId="dataset-series-contact-name"
                            name="dataset-series-contact-name"
                            label={{
                                text: 'Name: ',
                                inline: true,
                            }}
                            value={contactName}
                            onChange={e => setContactName(e.target.value)}
                            />
                        </div>
                        <div className="ons-grid__col ons-col-5@m ">
                            <TextInput
                            id="dataset-series-contact-email"
                            dataTestId="dataset-series-contact-email"
                            name="dataset-series-contact-email"
                            label={{
                                text: 'Email: ',
                                inline: true
                            }}
                            value={contactEmail}
                            onChange={e => setContactEmail(e.target.value)}
                            error={ (contactEmailError) ? {id:'dataset-series-email-error', text: 'Invalid email'} : undefined}
                            />
                        </div>
                        <div className="ons-grid__col ons-col-2@m ">
                            <Button
                            dataTestId="dataset-series-add-contact-button"
                            id="dataset-series-add-contact-button"
                            text="Add contact"
                            variants={[
                                'secondary',
                                'small'
                            ]}
                            onClick={() => {
                                if(!isEmail(contactEmail)){
                                    setContactEmailError(true)
                                } else {
                                    setContacts([
                                    ...contacts,
                                    { name: contactName, email: contactEmail }
                                    ]);

                                    setContactName('')
                                    setContactEmail('')
                                    setContactEmailError('')
                                }
                            }}
                            />
                        </div>
                    </div>
                </div>
            </Field>
        </>
    );
}
