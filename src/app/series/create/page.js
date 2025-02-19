'use client'

import { useActionState } from 'react';

import { TextInput, Label,  Field, Panel} from 'author-design-system-react';

import Hero from "@/components/hero/Hero"
import Contact from "@/components/contact/Contact";

import { createDatasetSeries } from "@/app/actions/datasetSeries"

export default function Create() {
    const [state, formAction] = useActionState(createDatasetSeries, null)
    return (
        <>
            <Hero hyperLink={{ text: 'View Existing Dataset Series', url: '/data-admin/series'}} title="Create dataset Series" wide/>
            { state == "success" ?
                <Panel variant="success">
                    <p>
                        Form successfully submitted
                    </p>
                </Panel> : ''
            }
            <h2>Series Details</h2>
            <form action={formAction}>
                <TextInput
                id="datasetSeriesTitle"
                dataTestId="datasetSeriesTitle"
                name="datasetSeriesTitle"
                label={{
                    text: 'Title'
                }}
                />
                <TextInput
                id="datasetSeriesID"
                dataTestId="datasetSeriesID"
                name="datasetSeriesID"
                label={{
                    text: 'ID'
                }}
                />
                <Field dataTestId="field-datasetseriesdescription">
                    <Label
                    id="descriptionLabelID"
                    dataTestId="descriptionLabelID"
                    for="datasetSeriesDescription"
                    text="Description"
                    />
                    <textarea name="datasetSeriesDescription" rows={5} cols={80} />
                </Field>
                <Contact/>
                <button type="submit" className="ons-btn">
                    <span className="ons-btn__inner"><span className="ons-btn__text">Save new dataset series</span></span>
                </button>
            </form>
        </>
    );
}
