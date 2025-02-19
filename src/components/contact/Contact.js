'use client'

import { useState } from 'react';

import { TextInput } from "author-design-system-react";
import { Button } from "author-design-system-react";
import { Summary } from 'author-design-system-react';


export default function Contact() {

    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contacts, setContacts] = useState([]);

    return (
        <>
            <h2>Contacts</h2>
            <Summary
                summaries={[
                    {
                        groups: [{
                            id: 'group1',
                            noDividers: true,
                            rows: contacts.map(contact => (
                                {
                                    id: 'row' + contact.email,
                                    rowItems: [
                                        {
                                            actions: [{
                                                isTertiaryButton: true,
                                                onClick: () => {
                                                    setContacts(
                                                        contacts.filter(c =>
                                                            c.email !== contact.email
                                                        )
                                                    )
                                                },
                                                text: 'Remove',
                                                url: '#',
                                                visuallyHiddenText: 'Remove'
                                            }],
                                            id: 'item' + contact.email,
                                            rowTitle: contact.name + ' - ' + contact.email
                                        }
                                    ]
                                }
                            ))
                        }]
                    }
                ]}
            />
            <input id="datasetSeriesContacts" type="hidden" name="datasetSeriesContacts" value={JSON.stringify(contacts)} />
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
        </>
    );
}
