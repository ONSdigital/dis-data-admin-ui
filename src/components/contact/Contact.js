'use client';

import { useState } from 'react';
import isEmail from 'validator/lib/isEmail';

import { TextInput, Field, Button } from "author-design-system-react";

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
                                <div className="ons-grid">
                                    <div className="ons-grid__col ons-col-3@m">
                                        <span className="ons-u-fw">{contact.name}</span>
                                    </div>
                                    <div className="ons-grid__col ons-col-3@m">
                                        <span className="ons-u-fw">{contact.email}</span>          
                                    </div>
                                    <div className="ons-grid__col ons-col-2@m">
                                        <Button
                                            dataTestId="datasetSeriesRemoveContactButton"
                                            id="datasetSeriesRemoveContactButton"
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
                                                );
                                            }}
                                        />
                                    </div>
                                </div>    
                            </div>
                        </li>
                    ))}
                    </ul> : null}
            </>
        );
    };

    return (
        <>
            <Field dataTestId="field-dataset-series-contacts" error={contactsError ? {id:'dataset-series-contacts-error', text: contactsError} : null}>
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
                                error={ (contactEmailError) ? {id:'dataSeriesEmailError', text: 'Invalid email'} : null}
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
                                        setContactEmailError(true);
                                    } else {
                                        setContacts([
                                        ...contacts,
                                        { name: contactName, email: contactEmail }
                                        ]);

                                        setContactName('');
                                        setContactEmail('');
                                        setContactEmailError('');
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
