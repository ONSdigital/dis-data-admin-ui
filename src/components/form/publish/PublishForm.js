"use client";

import { useActionState } from "react";

import Link from "next/link";

export default function PublishForm({ action, datasetID, datasetTitle, cancelLink}) {
    const [formState, formAction, isPending] = useActionState(action, {});

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    return (
        <form action={formAction}>
            <h1 className="ons-u-fs-xl ons-u-mb-no">{`Are you sure you want to publish "${datasetTitle}"?`}</h1>
            <p className="ons-u-mb-l">Approving this action will make the dataset series visible to the public.</p>
            <input type="hidden" name="dataset-id" value={datasetID} data-testid="hidden-dataset-id" readOnly />
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