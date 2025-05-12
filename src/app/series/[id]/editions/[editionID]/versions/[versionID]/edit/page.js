import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import Hero from "@/components/hero/Hero";
import VersionForm from "@/components/form/version/VersionForm";

export default async function EditVersion({ params }) {
    const { id, editionID, versionID } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const response = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions/${versionID}`);
    const version = response.next || response.current || response;

    return (
        <>
            <Hero hyperLink={{ text: `Back to dataset version overview`, url: "../" }} title={`Edit version ${versionID}`} wide /> 
            <VersionForm datasetID={id} editionID={editionID} />
        </>
    );
}