import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { updateDatasetVersion } from "@/app/actions/datasetVersion";

import PageHeading from "@/components/page-heading/PageHeading";
import VersionForm from "@/components/form/version/VersionForm";
import { Panel } from "@/components/design-system/DesignSystem";

export default async function EditVersion({ params }) {
    const { id, editionID, versionID } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const response = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions/${versionID}`);
    const version = response.next || response.current || response;

    let versionError;
    if (response.ok != null && !response.ok) {
        versionError = true;
    }

    return (
        <>
            { !versionError ?
                <>
                    <PageHeading 
                        title={`Edit version ${versionID}`}
                    /> 
                    <VersionForm datasetID={id} editionID={editionID} version={version} isNewVersion={false} action={updateDatasetVersion} />
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel> }
        </>
    );
}