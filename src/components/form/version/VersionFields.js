"use client";

import { useContext, useState } from "react";

import { Button, Select } from "author-design-system-react";

import { ConfigContext } from "@/context/context";

import MultiContentItems from "@/components/multi-content/MultiContentItems";
import ResumableFileUpload from "@/components/file-upload/ResumableFileUpload";
import DateTimePicker from "@/components/date-time/DateTimePicker";


export default function VersionFields(props) {
    const [qualityDesingation, setQualityDesingation] = useState(props.fieldValues?.quality_designation || "");

    const appConfig = useContext(ConfigContext);

    return (
        <>
            <h2 className="ons-u-mt-xl">Dataset version details</h2>
            <p>The information in these fields may be copied from the most recent version.</p>
            <div className="ons-u-mb-l">
                <Button variants="secondary" text="Copy from previous dataset"/>
            </div>

            <DateTimePicker 
                id="release-date" 
                dataTestId="release-date" 
                legend="Release date and time" 
                description="For example, 31 3 1980 09 30" 
                errors={props.errors} 
                releaseDate={props.fieldValues?.release_date}
            />

            <input id="quality-desingation-value" data-testid="quality-desingation-value-input" name="quality-desingation-value" type="hidden" value={qualityDesingation} />
            <Select id="quality-desingation" 
                label={{text: "Quality designation", description: "Something about what quality designation means"}} 
                dataTestId="quality-desingation"
                onChange={e => setQualityDesingation(e)} 
                error={ (props.errors && props.errors.quality_designation) ? {id:'quality-designation-error', text: props.errors.quality_designation} : null}
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
            <MultiContentItems id="usage-notes" fieldType="input" buttonLabel="Add new usage note" contentItems={props.fieldValues?.usage_notes || []}></MultiContentItems>

            <h3 className="ons-u-mt-xl">Alerts</h3>
            <MultiContentItems id="alerts" fieldType="select" buttonLabel="Add new alert" contentItems={props.fieldValues?.alerts || []}></MultiContentItems>

            <h2 className="ons-u-mt-xl">Dataset file</h2>
            <p>Select a dataset file from your local machine to upload to the Dataset Catalogue.</p>
            <ResumableFileUpload id="dataset-upload" 
                label="File upload" 
                description="Click browse or drag file here" 
                uploadBaseURL={appConfig?.uploadBaseURL} 
                validationError={(props.errors && props.errors.distributions) ? {id:'dataset-upload-error', text: props.errors.distributions} : null} 
                uploadedFile={props.fieldValues?.distributions[0]}
            />
        </>
    );
}