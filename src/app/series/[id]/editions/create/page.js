import { createDatasetEdition } from "@/app/actions/datasetEdition";

import EditionForm from "@/components/form/edition/EditionForm";
import PageHeading from "@/components/page-heading/PageHeading";

export default async function CreateEditionPage({ params }) {
    const { id } = await params;

    return (
        <>
            <PageHeading 
                title={`Create new dataset edition`}
                subtitle={id}
            /> 
            <EditionForm datasetID={id} isNewEdition={true} action={createDatasetEdition}/>
        </>
    );
}
