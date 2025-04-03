import CreateEditionForm from "./CreateEdition";


export default async function CreateEditionPage({ params }) {
    const { id } = await params;

    return (
        <>
            <CreateEditionForm datasetID={id} />
        </>
    );
}
