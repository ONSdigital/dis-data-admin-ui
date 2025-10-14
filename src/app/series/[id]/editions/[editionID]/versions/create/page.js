import { createDatasetVersion } from "@/app/actions/datasetVersion";

import { Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";
import VersionForm from "@/components/form/version/VersionForm";

export default async function CreateVersion({ params }) {
    const { id, editionID } = await params;

    return (
        <>
            <PageHeading 
                title="Create new dataset version"
                subtitle={`${id}: ${editionID}`}
            /> 
            <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                <p>You must fill in all fields unless marked optional</p>
            </Panel>
            <VersionForm datasetID={id} editionID={editionID} action={createDatasetVersion} />
        </>
    );
}