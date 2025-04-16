'use client'

import { useState, useActionState } from "react";

import { TextInput, Label,  Field, Panel, HyperLinksList} from "author-design-system-react";

import Hero from "@/components/hero/Hero"
import Topics from "@/components/topics/Topics";
import Contact from "@/components/contact/Contact";

export default function seriesForm({currentTitle = "", currentID = "", currentDescription = "", currentTopics = [], currentContacts = [], listOfTopics, action}) {

    const [title, setTitle] = useState(currentTitle)
    const [id, setID] = useState(currentID)
    const [topics, setTopics] = useState(currentTopics);
    const [description, setDescription] = useState(currentDescription)
    const [contacts, setContacts] = useState(currentContacts);

    const [formState, formAction, isPending] = useActionState(action, {})

    let listOfErrors = []

    if (formState.errors){
        Object.values(formState.errors).map((error) => (
            listOfErrors = [
                ...listOfErrors,
                {text: error}
            ]
        ))
    } 
    
    if (formState.recentlySumbitted == true) {
        formState.recentlySumbitted = false
        setTitle('')
        setID('')
        setDescription('')
        setContacts([])
        setTopics([])
    }

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    const renderSuccessOrFailure = () => {
        return (
            <>
                { formState.success == true  ?
                    <Panel variant="success">
                        <p>
                            Form submitted successfully
                        </p>
                    </Panel> : null
                }
                { formState.success == false && !formState.code ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <HyperLinksList itemsList={listOfErrors}/>
                    </Panel> : null
                }
                { formState.success == false && formState.code == 403 ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <p>
                            This datasetseries already exists
                        </p>
                    </Panel> : null
                }
            </>
        )
    }

    return (
        <>
            <Hero hyperLink={{ text: 'View Existing Dataset Series', url: '/data-admin/series'}} title="Create dataset series" wide/>
            {renderSuccessOrFailure()}
            <h2 className="ons-u-mt-m">Series Details</h2>
            <form action={formAction}>
                <input id="dataset-series-type" name="dataset-series-type" type="hidden" value={"static"} />
                { currentID != "" ? <input id="dataset-series-id" data-testid="dataset-series-id" name="dataset-series-id" type="hidden" value={id} /> : null}
                <TextInput 
                    id="dataset-series-title"
                    dataTestId="dataset-series-title"
                    name="dataset-series-title"
                    label={{
                        text: 'Title'
                    }}
                    error={(formState.errors && formState.errors.title) ? {id:'dataset-series-title-error', text: formState.errors.title} : null}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                { currentID == "" ?  
                    <TextInput 
                        id="dataset-series-id"
                        dataTestId="dataset-series-id"
                        name="dataset-series-id"
                        label={{
                            text: 'ID'
                        }}
                        error={(formState.errors && formState.errors.id)  ? {id:'dataset-series-id-error', text: formState.errors.id} : null}
                        value={id}
                        onChange={e => setID(e.target.value)}
                    /> : null
                }
                <Topics 
                    listOfTopics={listOfTopics} 
                    topics={topics} 
                    setTopics={setTopics} 
                    topicsError={(formState.errors && formState.errors.topics) ? formState.errors.topics : null}
                />
                <Field dataTestId="field-dataset-series-description" error={(formState.errors && formState.errors.description) ? {id:'dataset-series-description-error', text: formState.errors.description} : null}>
                    <Label 
                        id="description-label-id"
                        dataTestId="description-label-id"
                        for="dataset-series-description"
                        text="Description"
                    />
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        data-testid="dataset-series-description" 
                        name="dataset-series-description" 
                        rows={5} 
                        cols={80} 
                    />
                </Field>
                <Contact 
                    contacts={contacts} 
                    setContacts={setContacts} 
                    contactsError={(formState.errors && formState.errors.contacts) ? formState.errors.contacts : null}
                />
                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset series</span></span>
                </button>
            </form>
        </>
    );
}
