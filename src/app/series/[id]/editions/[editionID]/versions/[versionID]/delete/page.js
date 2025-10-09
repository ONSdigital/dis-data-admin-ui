import { deleteDatasetOrVersion } from "@/app/actions/delete";

import PageHeading from "@/components/page-heading/PageHeading";
import DeleteForm from "@/components/form/DeleteForm";

export default async function DeleteVersion({ params }) {
    const { id, editionID, versionID } = await params;

    return (
        <>
            <PageHeading
                title="Delete version"
                subtitle={`${id}: ${editionID} - Version ${versionID}`}
            />
            <DeleteForm datasetID={id} editionID={editionID} versionID={versionID} action={deleteDatasetOrVersion} />
        </>
    );
}