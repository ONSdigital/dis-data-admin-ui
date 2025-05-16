import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { updateDatasetVersion } from "@/app/actions/datasetVersion";

import Hero from "@/components/hero/Hero";
import VersionForm from "@/components/form/version/VersionForm";
import Panel from "@/components/panel/Panel";

export default async function EditVersion({ params }) {
    const { id, editionID, versionID } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const response = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions/${versionID}`);
    const version = response.next || response.current || response;

    let versionError;
    if (response.ok != null && !response.ok) {
        versionError = true;
    }

    const heroLink = `/data-admin/series/${id}/editions/${editionID}/versions/${versionID}`;
    return (
        <>
            { !versionError ?
                <>
                    <Hero hyperLink={{ text: `Back to dataset version overview`, url: heroLink }} title={`Edit version ${versionID}`} wide /> 
                    <VersionForm datasetID={id} editionID={editionID} version={version} action={updateDatasetVersion} />
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel> }
        </>
    );
}