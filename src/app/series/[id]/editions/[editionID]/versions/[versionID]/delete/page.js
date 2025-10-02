import { deleteDatasetOrVersion } from "@/app/actions/delete";

import PageHeading from "@/components/page-heading/PageHeading";
import DeleteForm from "@/components/form/DeleteForm";

export default async function DeleteVersion({ params }) {
    const { id, editionID, versionID } = await params;
    const resource = `${id}: ${editionID} - Version ${versionID}`;

    return (
        <>
            <PageHeading
                title="Delete version"
                subtitle={resource}
            />
            <DeleteForm datasetID={id} editionID={editionID} versionID={versionID} resource={resource} action={deleteDatasetOrVersion} />
        </>
    );
}