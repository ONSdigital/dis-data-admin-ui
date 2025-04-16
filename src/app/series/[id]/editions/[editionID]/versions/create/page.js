import Hero from "@/components/hero/Hero";

export default async function CreateVersion({ params }) {
    const { id, editionID } = await params;

    return (
        <>
            <Hero hyperLink={{ text: `Back to ${editionID} dataset edition overview`, url: "../" }} title={`Create a new dataset version for ${id}`} wide /> 
            <h1>Create version</h1>
        </>
    );
}