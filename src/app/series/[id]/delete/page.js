import { deleteDatasetOrVersion } from "@/app/actions/delete";

import PageHeading from "@/components/page-heading/PageHeading";
import DeleteForm from "@/components/form/delete/DeleteForm";

export default async function DeleteSeries({ params, searchParams }) {
    const { id } = await params;
    const query = await searchParams;
    const seriesTitle = query.seriesTitle;

    return (
        <>
            <PageHeading
                title="Delete series"
                subtitle={seriesTitle}
            />
            <DeleteForm datasetID={id} seriesTitle={seriesTitle} action={deleteDatasetOrVersion} />
        </>
    );
}
