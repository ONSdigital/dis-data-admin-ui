"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

import { HyperLinksList } from "author-design-system-react";

import { Panel } from "@/components/design-system/DesignSystem";
import VersionFields from './VersionFields';

export default function VersionForm({ datasetID, editionID, version, action }) {
    const [formState, formAction, isPending] = useActionState(action, {});

    const params = useSearchParams();
    const editionTitle = version?.edition_title || params.get("edition_title");

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
                            <p>Dataset version saved successfully.</p>
                        </Panel> : null
                }
                {
                    formState.success == false && !formState.code ?    
                        <Panel classes="ons-u-mb-xl"title="There was a problem creating this dataset version" variant="error">
                            <HyperLinksList itemsList={listOfErrors}/>
                        </Panel> : null
                }
                {
                    formState.success == false && formState.code ?    
                        <Panel classes="ons-u-mb-xl" title="There was a problem creating this dataset version" variant="error">
                            <p>An error occured when trying to create this dataset version.</p>
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
                <input id="edition-title" name="edition-title" type="hidden" value={editionTitle} />
                <input id="version-id" name="version-id" type="hidden" value={version?.version} />

                <VersionFields fieldValues={version} errors={formState.errors} />

                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset version</span></span>
                </button>
            </form>
        </>
    );
}