import Hero from "@/components/hero/Hero";
import VersionForm from "./VersionForm";

export default async function CreateVersion({ params }) {
    const { id, editionID } = await params;

    return (
        <>
            <Hero hyperLink={{ text: `Back to ${editionID} dataset edition overview`, url: "../" }} title={`Create a new dataset version for ${id}`} wide /> 
            <VersionForm datasetID={id} editionID={editionID} />
        </>
    );
}