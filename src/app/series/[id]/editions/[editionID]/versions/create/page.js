import { createDatasetVersion } from "@/app/actions/datasetVersion";

import PageHeading from "@/components/page-heading/PageHeading";
import VersionForm from "@/components/form/version/VersionForm";

export default async function CreateVersion({ params }) {
    const { id, editionID } = await params;

    return (
        <>
            <PageHeading 
                title="Create new version"
                subtitle={`${id}: ${editionID}`}
            /> 
            <VersionForm datasetID={id} editionID={editionID} action={createDatasetVersion} />
        </>
    );
}