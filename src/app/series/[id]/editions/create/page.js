import CreateEditionForm from "@/components/form/edition/EditionForm";


export default async function CreateEditionPage({ params }) {
    const { id } = await params;

    return (
        <>
            <CreateEditionForm datasetID={id} />
        </>
    );
}
