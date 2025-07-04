"use client";

import { useActionState, useState } from "react";
import DOMPurify from "dompurify";

import { TextInput, HyperLinksList } from "author-design-system-react";

import { createDatasetEdition } from "@/app/actions/datasetEdition";

import Panel from "@/components/panel/Panel";
import VersionFields from "@/components/form/version/VersionFields";

export default function CreateEditionForm({ datasetID, edition, isNewEdition, action }) {
    const [formState, formAction, isPending] = useActionState(action, {});
    const [editionID, setEditionID] = useState(edition?.edition || "");
    const [editionTitle, setEditionTitle] = useState(edition?.edition_title || "");

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

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
            <h2>Edition details</h2>
            <p>The information in these fields is unique to this edition.</p>
            <form action={formAction}>
                <input id="dataset-id" name="dataset-id" type="hidden" value={datasetID} />
                <input id="current-edition-id" name="current-edition-id" type="hidden" value={edition?.edition} />
                <TextInput id="edition-id" 
                    name="edition-id" 
                    label={{text: `Edition ID`, description: `E.g "january-2025" or "time-series"`}} 
                    dataTestId="edition-id"
                    value={editionID}
                    onChange={e => setEditionID(e.target.value)}
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

                { isNewEdition ? <VersionFields errors={formState.errors} /> : null }

                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset edition</span></span>
                </button>
            </form>
        </>
    );
}