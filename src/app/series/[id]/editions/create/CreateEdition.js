"use client";

import { useActionState, useState } from 'react';
import DOMPurify from "dompurify";

import { TextInput, HyperLinksList } from "author-design-system-react";

import { createDatasetEdition } from '@/app/actions/createDatasetEdition';

import Hero from "@/components/hero/Hero";
import Panel from "@/components/panel/Panel";
import VersionFields from '../[editionID]/versions/create/VersionFields';
import MultiContentItems from '@/components/multi-content/MultiContentItems';
import ResumableFileUpload from "@/components/file-upload/ResumableFileUpload";
import DateTimePicker from '@/components/date-time/DateTimePicker';


export default function CreateEditionForm({ datasetID }) {
    const [formState, formAction, isPending] = useActionState(createDatasetEdition, {});
    const [edition, setEdition] = useState("");
    const [editionTitle, setEditionTitle] = useState("");

    let listOfErrors = [];
    if (formState) {
        if (formState.errors){
            Object.values(formState.errors).map((error) => (
                listOfErrors = [
                    ...listOfErrors,
                    {text: error}
                ]
            ));
        }
    }  

    const renderSuccessOrFailure = () => {
        return (
            <>
                { 
                    formState.success == true  ?
                        <Panel classes="ons-u-mb-xl" variant="success">
                            <p>{`Dataset edition "${DOMPurify.sanitize(edition)}" created successfully. View new `}<a href={DOMPurify.sanitize(edition)}>edition.</a></p>
                        </Panel> : null
                }
                {
                    formState.success == false && !formState.code ?    
                        <Panel classes="ons-u-mb-xl"title="There was a problem creating this dataset edition" variant="error">
                            <HyperLinksList itemsList={listOfErrors}/>
                        </Panel> : null
                }
                {
                    formState.success == false && formState.code ?    
                        <Panel classes="ons-u-mb-xl" title="There was a problem creating this dataset edition" variant="error">
                            <p>An error occured when trying to create this dataset edition.</p>
                        </Panel> : null
                }
            </>
        );
    };

    return (
        <>
            <Hero hyperLink={{ text: `Back to ${datasetID} dataset series overview`, url: "../" }} title={`Create a new dataset edition for ${datasetID}`} wide />     
            { renderSuccessOrFailure() }      
            <h2>Edition details</h2>
            <p>The information in these fields is unique to this edition.</p>
            <form action={formAction}>
                <input id="dataset-id" name="dataset-id" type="hidden" value={datasetID} />
                <TextInput id="edition-id" 
                    name="edition-id" 
                    label={{text: `Edition ID`, description: `E.g "january-2025" or "time-series"`}} 
                    dataTestId="edition-id"
                    value={edition}
                    onChange={e => setEdition(e.target.value)}
                    error={ (formState.errors && formState.errors.edition) ? {id:'edition-id-error', text: formState.errors.edition} : null}
                />

                <TextInput id="edition-title" 
                    name="edition-title" 
                    label={{text: `Edition title`, description: `E.g "January 2025" or "Time series"`}} 
                    dataTestId="edition-title"
                    value={editionTitle}
                    onChange={e => setEditionTitle(e.target.value)}
                    error={ (formState.errors && formState.errors.edition_title) ? {id:'edition-title-error', text: formState.errors.edition_title} : null}
                />

                <VersionFields errors={formState.errors} />

                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset edition</span></span>
                </button>
            </form>
        </>
    );
}