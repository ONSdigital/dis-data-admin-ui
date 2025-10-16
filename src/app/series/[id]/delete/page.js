import { deleteDatasetOrVersion } from "@/app/actions/delete";

import PageHeading from "@/components/page-heading/PageHeading";
import DeleteForm from "@/components/form/DeleteForm";

export default async function DeleteSeries({ params }) {
    const { id } = await params;

    return (
        <>
            <PageHeading
                title="Delete series"
                subtitle={id}
            />
            <DeleteForm datasetID={id} action={deleteDatasetOrVersion} />
        </>
    );
}