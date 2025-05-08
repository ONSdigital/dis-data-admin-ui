import Hero from "@/components/hero/Hero";
import VersionForm from "@/components/form/version/VersionForm";

export default async function EditVersion({ params }) {
    const { id, editionID, versionID } = await params;

    return (
        <>
            <Hero hyperLink={{ text: `Back to dataset version overview`, url: "../" }} title={`Edit version ${versionID}`} wide /> 
            <VersionForm datasetID={id} editionID={editionID} />
        </>
    );
}