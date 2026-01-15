"use client";

import { useActionState } from "react";

import { Panel } from "author-design-system-react";

import Link from "next/link";

export default function PublishForm({ action, dataset, cancelLink}) {
    const [formState, formAction, isPending] = useActionState(action, {});

    const renderError = () => {
        if (formState?.success === false) {
            return (
                <Panel dataTestId="delete-error" classes="ons-u-mb-xl" title="There was a problem publishing" variant="error">
                    <p>{formState?.errors?.api || "An error occurred while trying to publish this dataset series."}</p>
                </Panel>
            );
        }
    };

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    return (
        <form action={formAction}>
            { renderError() }
            <h1 className="ons-u-fs-xl ons-u-mb-no">{`Are you sure you want to publish "${dataset?.title}"?`}</h1>
            <p className="ons-u-mb-l">Approving this action will make the dataset series visible to the public.</p>
            <input type="hidden" name="dataset" value={JSON.stringify(dataset)} data-testid="hidden-dataset" readOnly />
            <button data-testid="dataset-series-publish-button" type="submit" className={`ons-btn ons-u-mr-m ${isPending === true &&  "ons-btn--disabled"}`} disabled={isPending}>
                <span className="ons-btn__inner jon">
                    <span className="ons-btn__text">
                        Publish
                    </span>
                </span>
            </button>
            <Link href={cancelLink} className="ons-u-dib ons-u-mt-xs" data-testid="dataset-series-cancel-link">Cancel</Link>
        </form>
    );
}