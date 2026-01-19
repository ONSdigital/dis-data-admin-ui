import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { createDatasetVersion } from "@/app/actions/datasetVersion";

import { Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";
import VersionForm from "@/components/form/version/VersionForm";

export default async function CreateVersion({ params }) {
    const { id, editionID } = await params;
    
    const reqCfg = await SSRequestConfig(cookies);
    const datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
        
    let datasetError = false;
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }
    
    const dataset = datasetResp?.current || datasetResp?.next || datasetResp;

    let datasetTitle;
    if (datasetError) {
        datasetTitle = "Error retrieving name of dataset";
    } else {
        datasetTitle = dataset.title;
    }
    

    return (
        <>
            <PageHeading 
                title="Create new version"
                subtitle={datasetTitle}
            /> 
            <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                <p>You must fill in all fields unless marked optional</p>
            </Panel>
            <VersionForm datasetID={id} editionID={editionID} isNewVersion={true} action={createDatasetVersion} />
        </>
    );
}