"use client";

import { useActionState, useState } from "react";

import { TextInput, HyperLinksList } from "author-design-system-react";
import LinkButton from "@/components/link-button/LinkButton";

import { Panel } from "@/components/design-system/DesignSystem";
import VersionFields from "@/components/form/version/VersionFields";

export default function EditionForm({ datasetID, edition, isNewEdition, showEditionIDField, action }) {
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

    const renderFailure = () => {
        return (
            <>
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
            { renderFailure() }      
            <form action={formAction}>
                <input id="dataset-id" name="dataset-id" type="hidden" value={datasetID} />
                <input id="current-edition-id" name="current-edition-id" type="hidden" value={edition?.edition} />
                { !showEditionIDField ? 
                    <TextInput id="edition-id" 
                        name="edition-id" 
                        label={{text: `Edition ID`, description: `E.g "january-2025" or "time-series"`}} 
                        dataTestId="edition-id"
                        value={editionID}
                        classes="ons-input--block ons-input-number--w-50"
                        onChange={e => setEditionID(e.target.value)}
                        error={ (formState.errors && formState.errors.edition) ? {id:'edition-id-error', text: formState.errors.edition} : null}
                    />
                :  <input id="edition-id" name="edition-id" type="hidden" value={edition?.edition} /> }

                <TextInput id="edition-title" 
                    name="edition-title" 
                    label={{text: `Edition title`, description: `E.g "January 2025" or "Time series"`}} 
                    dataTestId="edition-title"
                    classes={`ons-input--block ons-input-number--w-50 ${isNewEdition ? "ons-u-mb-l" : ""}`}
                    value={editionTitle}
                    onChange={e => setEditionTitle(e.target.value)}
                    error={ (formState.errors && formState.errors.edition_title) ? {id:'edition-title-error', text: formState.errors.edition_title} : null}
                />

                { isNewEdition ? <VersionFields errors={formState.errors} /> : null }

                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending} data-testid="edition-save-button">
                    <span className="ons-btn__inner"><span className="ons-btn__text">Create edition</span></span>
                </button>
                <LinkButton
                    dataTestId="edition-cancel-button"
                    id="edition-cancel"
                    text="Cancel"
                    link={"/series/" + datasetID}
                    variants="secondary"
                    classes="ons-u-mt-l ons-u-ml-l"
                />
            </form>
        </>
    );
}