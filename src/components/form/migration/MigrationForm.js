"use client";

import { useState, useActionState } from "react";

import { TextInput, Panel, HyperLinksList } from "author-design-system-react";
import LinkButton from "@/components/link-button/LinkButton";

export default function MigrationForm({ action }) {

    const [formState, formAction, isPending] = useActionState(action, {});
    const [sourceURI, setSourceURI] = useState("");
    const [id, setID] = useState("");

    let listOfErrors = [];

    if (formState.errors) {
        Object.values(formState.errors).map((error) => (
            listOfErrors = [
                ...listOfErrors,
                { text: error }
            ]
        ));
    }

    const renderFailure = () => {
        return (
            <>
                {formState.success == false && !formState.code ?
                    <Panel title="There was a problem submitting your form" variant="error">
                        <HyperLinksList itemsList={listOfErrors} />
                    </Panel> : null
                }
                {formState.success == false && formState.code >= 400 ?
                    <Panel title="There was a problem submitting your form" variant="error">
                        <p>{formState.httpError || "An unknown error occurred"}</p>
                    </Panel> : null
                }
            </>
        );
    };

    return (
        <>
            {renderFailure()}
            <form className="ons-u-mt-m" action={formAction}>
                <input id="dataset-series-type" name="dataset-series-type" type="hidden" value="static_dataset" />
                <TextInput
                    id="source-uri"
                    dataTestId="source-uri"
                    classes="ons-input--block ons-input-number--w-50"
                    name="source-uri"
                    label={{
                        text: "Source URI",
                        description: `E.g "/economy/inflationandpriceindices"`
                    }}
                    value={sourceURI}
                    onChange={e => setSourceURI(e.target.value)}
                />
                <TextInput
                    id="dataset-series-id"
                    dataTestId="dataset-series-id"
                    classes="ons-input--block ons-input-number--w-50"
                    name="dataset-series-id"
                    label={{
                        text: "Series ID",
                        description: `E.g "labour-market" or "weekly-registered-deaths"`,
                    }}
                    value={id}
                    onChange={e => setID(e.target.value)}
                />
                <button data-testid="create-migration-job-save" type="submit" className={isPending == true ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"} disabled={isPending}>
                    <span className="ons-btn__inner">
                        <span className="ons-btn__text">
                            Create Job
                        </span>
                    </span>
                </button>
                <LinkButton
                    dataTestId="create-migration-job-cancel"
                    id="create-migration-job-cancel"
                    text="Cancel"
                    link="/migration"
                    variants="secondary"
                    classes="ons-u-mt-l ons-u-ml-l"
                />
            </form>
        </>
    );
}
