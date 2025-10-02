"use client";

import { useActionState } from "react";

import { Panel, Checkbox } from "author-design-system-react";

export default function DeleteForm({ datasetID, editionID = "", versionID = "", resource, action }) {
    const [formState, formAction, isPending] = useActionState(action, {});

    if(isPending){
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="dataset-id" value={datasetID} />
            <input type="hidden" name="edition-id" value={editionID} />
            <input type="hidden" name="version-id" value={versionID} />
            <input type="hidden" name="resource" value={resource} />

            {formState?.errors?.api && (
                <Panel
                    dataTestId="delete-error"
                    classes="ons-u-mb-xl"
                    title="There was a problem deleting"
                    variant="error"
                >
                    <p>An error occurred while trying to delete.</p>
                </Panel>
            )}

            <Checkbox
                dataTestId="confirm-delete"
                id="confirm-delete"
                name="confirm-delete"
                legend={`Are you sure you want to delete this item? (${resource})`}
                legendIsQuestionTitle
                items={{
                    itemsList: [
                        {
                            id: "confirm-delete-yes",
                            name: "confirm-delete",
                            label: {
                                text: "Yes",
                            },
                            value: "yes",
                        }
                    ]
                }}
                error={formState?.errors?.["confirm-delete"]
                    ? {
                        id: "confirm-delete-error",
                        text: formState.errors["confirm-delete"][0]
                    }
                    : undefined
                }
            />

            <button
                 type="submit"
                 className={isPending ? "ons-btn ons-btn ons-u-mt-l ons-btn--disabled" : "ons-btn ons-u-mt-l"}
                 disabled={isPending}>
                <span className="ons-btn__inner"><span className="ons-btn__text">Delete</span></span>
            </button>
        </form>
    );
}