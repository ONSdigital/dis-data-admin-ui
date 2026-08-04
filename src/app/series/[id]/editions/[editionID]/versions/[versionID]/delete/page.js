import { deleteDatasetOrVersion } from "@/app/actions/delete";

import PageHeading from "@/components/page-heading/PageHeading";
import DeleteForm from "@/components/form/delete/DeleteForm";

export default async function DeleteVersion({ params, searchParams }) {
    const { id, editionID, versionID } = await params;
    const query = await searchParams;
    const seriesTitle = query.seriesTitle
    const editionTitle = query.editionTitle

    return (
        <>
            <PageHeading
                title="Delete version"
                subtitle={`${seriesTitle}: ${editionTitle} - Version ${versionID}`}
            />
            <DeleteForm datasetID={id} editionID={editionID} versionID={versionID} seriesTitle={seriesTitle} editionTitle={editionTitle} action={deleteDatasetOrVersion} />
        </>
    );
}
