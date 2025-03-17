"use client";

import { useContext, useActionState, useState } from 'react';
import { ConfigContext } from '@/context/context';

import { createDatasetEdition } from '@/app/actions/createDatasetEdition';

import Hero from "@/components/hero/Hero";
import Panel from "@/components/panel/Panel";
import MultiContentItems from '@/components/multi-content/MultiContentItems';
import ResumableFileUpload from "@/components/file-upload/ResumableFileUpload";

import { TextInput, Button, Select, HyperLinksList, Link } from "author-design-system-react";

export default function CreateEditionForm({ datasetID }) {
    const [formState, formAction, isPending] = useActionState(createDatasetEdition, {});
    const [editionTitle, setEditionTitle] = useState("");
    const [qualityDesingation, setQualityDesingation] = useState("");

    const appConfig = useContext(ConfigContext);

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
            // setTitle('')
            // setID('')
            // setDescription('')
            // setContacts([])
        }
    }  

    const renderSuccessOrFailure = () => {
        return (
            <>
                { 
                    formState.success == true  ?
                        <Panel classes="ons-u-mb-xl" variant="success">
                            <p>Dataset edition "{editionTitle}" created successfully. View new <a href={editionTitle}>edition.</a></p>
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
        )
    }

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
                    label={{text: `Edition title`, description: `E.g "January-2025" or "time-series"`}} 
                    dataTestId="edition-id"
                    value={editionTitle}
                    onChange={e => setEditionTitle(e.target.value)}
                    error={ (formState.errors && formState.errors.title) ? {id:'edition-title-error', text: formState.errors.title} : null}
                />

                <h2 className="ons-u-mt-xl">Dataset details</h2>
                <p>The information in these fields may be copied from the most recent version.</p>
                <div className="ons-u-mb-l">
                    <Button variants="secondary" text="Copy from previous dataset"/>
                </div>
                <input id="quality-desingation-value" name="quality-desingation-value" type="hidden" value={qualityDesingation} />
                <Select id="quality-desingation" 
                    label={{text: "Quality designation", description: "Something about what quality designation means"}} 
                    onChange={e => setQualityDesingation(e)} 
                    error={ (formState.errors && formState.errors.quality_designation) ? {id:'quality-designation-error', text: formState.errors.quality_designation} : null}
                    options={[
                        {
                            value:"",
                            text: "Select an option",
                            disabled: true
                        },
                        {
                            value:"accredited-official",
                            text: "National Statistic",
                        },
                        {
                            value:"official",
                            text: "Offical Statistic",
                        },
                        {
                            value:"official-in-development",
                            text: "Offical Statistic in Development",
                        },
                        {
                            value:"",
                            text: "None",
                        },
                    ]}
                />
                <h3 className="ons-u-mt-xl">Usage notes</h3>
                <MultiContentItems id="usage-notes" fieldType="input" buttonLabel="Add new usage note" contentItems={[]}></MultiContentItems>

                <h3 className="ons-u-mt-xl">Alerts</h3>
                <MultiContentItems id="alerts" fieldType="select" buttonLabel="Add new alert" contentItems={[]}></MultiContentItems>

                <h2 className="ons-u-mt-xl">Dataset file</h2>
                <p>Select a dataset file from your local machine to upload to the Dataset Catalogue.</p>
                <ResumableFileUpload id="dataset-upload" 
                    label="File upload" 
                    description="Click browse or drag file here" 
                    uploadBaseURL={appConfig.uploadBaseURL} 
                    validationError={(formState.errors && formState.errors.distributions) ? {id:'dataset-upload-error', text: formState.errors.distributions} : null} />

                <button type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset series</span></span>
                </button>
            </form>
        </>
    );
}