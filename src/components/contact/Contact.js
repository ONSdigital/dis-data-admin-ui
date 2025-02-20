'use client'

import { useState } from 'react';

import { TextInput } from "author-design-system-react";
import { Button } from "author-design-system-react";
import { Field } from 'author-design-system-react';

export default function Contact({contactsError}) {

    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contacts, setContacts] = useState([]);

    return (
        <>
            <Field error={contactsError ? {id:'dataSeriesContactsError', text: contactsError} : undefined}>
            <h2>Contacts</h2>
                <input id="datasetSeriesContacts" type="hidden" name="datasetSeriesContacts" value={JSON.stringify(contacts)} />
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
                                            )
                                        }}
                                        />
                                    </div>
                                </div>
                            </div>      
                        </div>
                    </li>
                ))}
                </ul>
            : ""}
                <div className='ons-container--wide'>
                    <div className="ons-grid ons-grid--spaced">                
                        <div className="ons-grid__col ons-col-5@m">
                            <TextInput
                            id="datasetSeriesContactName"
                            dataTestId="datasetSeriesContactName"
                            name="datasetSeriesContactName"
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
                            id="datasetSeriesContactEmail"
                            dataTestId="datasetSeriesContactEmail"
                            name="datasetSeriesContactEmail"
                            label={{
                                text: 'Email: ',
                                inline: true
                            }}
                            value={contactEmail}
                            onChange={e => setContactEmail(e.target.value)}
                            />
                        </div>
                        <div className="ons-grid__col ons-col-2@m ">
                            <Button
                            dataTestId="datasetSeriesAddContactButton"
                            id="datasetSeriesAddContactButton"
                            text="Add contact"
                            variants={[
                                'secondary',
                                'small'
                            ]}
                            onClick={() => {
                                setContacts([
                                ...contacts,
                                { name: contactName, email: contactEmail }
                                ]);

                                setContactName('')
                                setContactEmail('')
                            }}
                            />
                        </div>
                    </div>
                </div>
                </Field>
        </>
    );
}
