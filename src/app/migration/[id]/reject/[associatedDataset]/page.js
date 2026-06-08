import StateChangeButton from "@/components/state-change-button/StateChangeButton";
import LinkButton from "@/components/link-button/LinkButton";

import { updateMigrationJobState } from "@/app/actions/migrationJob";

export default async function reject({ params }) {
    const { id, associatedDataset } = await params;

    return (
        <>
            <h1>Are you sure you want to reject {associatedDataset} ?</h1>
            <StateChangeButton
                classes="ons-u-mt-m ons-u-pt-m"
                dataTestId="migration-reject-button"
                id="migration-reject-button"
                text="Reject"
                jobID={id}
                jobState={"rejected"}
                series={associatedDataset}
                onClick={updateMigrationJobState}
            />
            <LinkButton
                dataTestId="create-migration-job-cancel"
                id="create-migration-job-cancel"
                text="Cancel"
                link={`/migration/${id}`}
                variants="secondary"
                classes="ons-u-ml-xs ons-u-mt-m ons-u-pt-m"
            />

        </>
    );
}