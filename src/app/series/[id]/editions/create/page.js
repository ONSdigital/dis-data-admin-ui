import CreateEditionForm from "@/components/form/edition/EditionForm";
import Hero from "@/components/hero/Hero";

export default async function CreateEditionPage({ params }) {
    const { id } = await params;

    return (
        <>
            <Hero hyperLink={{ text: `Back to ${id} dataset series overview`, url: "../" }} title={`Create a new dataset edition for ${id}`} wide /> 
            <CreateEditionForm datasetID={id} isNewEdition={true}/>
        </>
    );
}
