'use client'

import { useActionState, useState } from "react";

import { TextInput, Label,  Field, Panel, HyperLinksList} from "author-design-system-react";

import Hero from "@/components/hero/Hero"
import Contact from "@/components/contact/Contact";

import { createDatasetSeries } from "@/app/actions/datasetSeries"

export default function Create() {
    const [formState, formAction, isPending] = useActionState(createDatasetSeries, {})

    const [title, setTitle] = useState('')
    const [id, setID] = useState('')
    const [description, setDescription] = useState('')
    const [contacts, setContacts] = useState([]);

    let listOfErrors = []
    if (formState) {
        if (formState.errors){
            Object.values(formState.errors).map((error) => (
                listOfErrors = [
                    ...listOfErrors,
                    {text: error}
                ]
            ))
        } else if (formState.recentlySumbitted == true) {
            formState.recentlySumbitted = false
            setTitle('')
            setID('')
            setDescription('')
            setContacts([])
        }
    }    

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    return (
        <>
            <Hero hyperLink={{ text: 'View Existing Dataset Series', url: '/data-admin/series'}} title="Create dataset series" wide/>
            { 
                formState.success == true  ?
                    <Panel variant="success">
                        <p>
                            Form submitted successfully
                        </p>
                    </Panel> : ""
            }
            {
                formState.success == false && !formState.code ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <HyperLinksList itemsList={listOfErrors}/>
                    </Panel> : ""
            }
            {
                formState.success == false && formState.code == 403 ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <p>
                            This datasetseries already exists
                        </p>
                    </Panel> : ""
            }
            <h2 className="ons-u-mt-m">Series Details</h2>
            <form action={formAction}>
                <TextInput
                id="datasetSeriesTitle"
                dataTestId="datasetSeriesTitle"
                name="datasetSeriesTitle"
                label={{
                    text: 'Title'
                }}
                error={ (formState.errors && formState.errors.title) ? {id:'dataSeriesTitleError', text: formState.errors.title} : undefined}
                value={title}
                onChange={e => setTitle(e.target.value)}
                />
                <TextInput
                id="datasetSeriesID"
                dataTestId="datasetSeriesID"
                name="datasetSeriesID"
                label={{
                    text: 'ID'
                }}
                error={(formState.errors && formState.errors.id)  ? {id:'dataSeriesIDError', text: formState.errors.id} : undefined}
                value={id}
                onChange={e => setID(e.target.value)}
                />
                <Field 
                dataTestId="field-datasetseriesdescription"             
                error={(formState.errors && formState.errors.description) ? {id:'dataSeriesDescriptionError', text: formState.errors.description} : undefined}    
                >
                    <Label
                    id="descriptionLabelID"
                    dataTestId="descriptionLabelID"
                    for="datasetSeriesDescription"
                    text="Description"
                    />
                    <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)} 
                    name="datasetSeriesDescription" 
                    rows={5} 
                    cols={80} />
                </Field>
                <Contact contacts={contacts} setContacts={setContacts} contactsError={(formState.errors && formState.errors.contacts) ? formState.errors.contacts : undefined}/>
                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset series</span></span>
                </button>
            </form>
        </>
    );
}
