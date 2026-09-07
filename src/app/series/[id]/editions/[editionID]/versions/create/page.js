import { cookies } from "next/headers";

import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { getDataset } from "@/utils/request/api-clients/datasets";

import { createDatasetVersion } from "@/app/actions/datasetVersion";

import { Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";
import VersionForm from "@/components/form/version/VersionForm";

export default async function CreateVersion({ params }) {
    const { id, editionID } = await params;
    const accessToken = await getAcessTokenFromCookie(cookies);
    const datasetResp = await getDataset(id, accessToken);
    
    const dataset = datasetResp?.response?.current || datasetResp?.response?.next || datasetResp?.response;

    let datasetTitle;
    if (datasetResp.error) {
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
            <VersionForm datasetID={id} editionID={editionID} isNewVersion={true} action={createDatasetVersion} accessToken={accessToken} />
        </>
    );
}