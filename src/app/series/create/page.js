'use client'

import { useActionState, useState, useEffect } from 'react';

import { TextInput, Label,  Field, Panel, HyperLinksList} from 'author-design-system-react';

import Hero from "@/components/hero/Hero"
import Contact from "@/components/contact/Contact";

import { createDatasetSeries } from "@/app/actions/datasetSeries"

export default function Create() {
    const [formState, formAction] = useActionState(createDatasetSeries, {})

    let listOfErrors = []
    if (formState && formState.errors) {
        Object.entries(formState.errors).map((error) => (
            listOfErrors = [
                ...listOfErrors,
                {text: error[1][0]}
            ]
        ))
    }

    return (
        <>
            <Hero hyperLink={{ text: 'View Existing Dataset Series', url: '/data-admin/series'}} title="Create dataset Series" wide/>
            { 
                formState.success == true  ?
                    <Panel variant="success">
                        <p>
                            Form submitted successfully
                        </p>
                    </Panel> : ""}{
                formState.success == false  ?    
                    <Panel title="There was a problem submitting your form" variant="error">
                        <HyperLinksList itemsList={listOfErrors}/>
                    </Panel> : ""
            }
            <h2 className="ons-u-mt-l">Series Details</h2>
            <form action={formAction}>
                <TextInput
                id="datasetSeriesTitle"
                dataTestId="datasetSeriesTitle"
                name="datasetSeriesTitle"
                label={{
                    text: 'Title'
                }}
                error={ (formState.errors && formState.errors.title) ? {id:'dataSeriesTitleError', text: formState.errors.title} : undefined}
                />
                <TextInput
                id="datasetSeriesID"
                dataTestId="datasetSeriesID"
                name="datasetSeriesID"
                label={{
                    text: 'ID'
                }}
                error={(formState.errors && formState.errors.id)  ? {id:'dataSeriesIDError', text: formState.errors.id} : undefined}
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
                    <textarea name="datasetSeriesDescription" rows={5} cols={80} />
                </Field>
                <Contact contactsError={(formState.errors && formState.errors.contacts) ? formState.errors.contacts : undefined}/>
                <button type="submit" className="ons-btn ons-u-mt-l">
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset series</span></span>
                </button>
            </form>
        </>
    );
}
