import { deleteDatasetOrVersion } from "@/app/actions/delete";

import PageHeading from "@/components/page-heading/PageHeading";
import DeleteForm from "@/components/form/DeleteForm";

export default async function DeleteSeries({ params }) {
    const { id } = await params;
    const resource = `${id}`;

    return (
        <>
            <PageHeading
                title="Delete series"
                subtitle={resource}
            />
            <DeleteForm datasetID={id} resource={resource} action={deleteDatasetOrVersion} />
        </>
    );
}