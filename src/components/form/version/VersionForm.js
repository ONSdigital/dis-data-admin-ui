"use client";

import { useActionState } from 'react';
import DOMPurify from "dompurify";

import { HyperLinksList } from "author-design-system-react";

import { datasetVersion } from '@/app/actions/datasetVersion';

import Panel from "@/components/panel/Panel";
import VersionFields from './VersionFields';

export default function VersionForm({ datasetID, editionID }) {
    const [formState, formAction, isPending] = useActionState(datasetVersion, {});

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
            { renderSuccessOrFailure() }      
            <form action={formAction}>
                <input id="dataset-id" name="dataset-id" type="hidden" value={datasetID} />
                <input id="edition-id" name="edition-id" type="hidden" value={editionID} />

                <VersionFields errors={formState.errors} />

                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset edition</span></span>
                </button>
            </form>
        </>
    );
}