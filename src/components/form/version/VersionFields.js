"use client";

import { useContext, useState } from "react";

import { Radios } from "author-design-system-react";

import { ConfigContext } from "@/context/context";

import MultiContentItems from "@/components/multi-content/MultiContentItems";
import ResumableFileUpload from "@/components/file-upload/ResumableFileUpload";
import DateTimePicker from "@/components/date-time/DateTimePicker";


export default function VersionFields(props) {
    const [qualityDesignation, setQualityDesignation] = useState(props.fieldValues?.quality_designation || "");

    const appConfig = useContext(ConfigContext);

    const isChecked = (fieldID) => {
        if (fieldID === qualityDesignation) { return true; }
        return false;
    };

    return (
        <>
            <DateTimePicker
                id="release-date"
                dataTestId="release-date"
                legend="Release date and time"
                description="For example, 31 3 1980 09 30"
                errors={props.errors}
                releaseDate={props.fieldValues?.release_date}
            />

            <input id="quality-designation-value" data-testid="quality-designation-value-input" name="quality-designation-value" type="hidden" value={qualityDesignation} />
            <Radios
                dataTestId="quality-designation-radios"
                legend="Quality designation"
                name="quality-designation-radios"
                error={(props.errors && props.errors.quality_designation) ? { id: "quality-designation-error", text: props.errors.quality_designation } : null}
                borderless={true}
                radios={{
                    radioList: [
                        {
                            id: "accredited-official",
                            label: {
                                text: "National Statistic"
                            },
                            value: "accredited-official",
                            onChange: e => setQualityDesignation(e.target.value),
                            checked: isChecked("accredited-official")
                        },
                        {
                            id: "official",
                            label: {
                                text: "Official Statistic"
                            },
                            value: "official",
                            onChange: e => setQualityDesignation(e.target.value),
                            checked: isChecked("official")
                        },
                        {
                            id: "official-in-development",
                            label: {
                                text: "Official Statistic in Development"
                            },
                            value: "official-in-development",
                            onChange: e => setQualityDesignation(e.target.value),
                            checked: isChecked("official-in-development")
                        },
                        {
                            id: "no-accreditation",
                            label: {
                                text: "No accreditation"
                            },
                            value: "no-accreditation",
                            onChange: e => setQualityDesignation(e.target.value),
                            checked: isChecked("no-accreditation")
                        }
                    ]
                }}
            />
            <h3 className="ons-u-mt-xl">Usage notes</h3>
            <MultiContentItems id="usage-notes" fieldType="input" buttonLabel="Add additional usage note" contentItems={props.fieldValues?.usage_notes || []}></MultiContentItems>

            <h3 className="ons-u-mt-xl">Alerts</h3>
            <MultiContentItems id="alerts" fieldType="radios" buttonLabel="Add additional alert" contentItems={props.fieldValues?.alerts || []}></MultiContentItems>

            <h2 className="ons-u-mt-xl">Dataset file</h2>
            <ResumableFileUpload id="dataset-upload"
                label="File upload"
                description="Click browse or drag file here"
                uploadBaseURL={appConfig?.uploadBaseURL}
                validationError={(props.errors && props.errors.distributions) ? { id: "dataset-upload-error", text: props.errors.distributions } : null}
                uploadedFile={props.fieldValues?.distributions[0]}
            />
        </>
    );
}