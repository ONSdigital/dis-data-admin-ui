import { cookies } from "next/headers";

import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { getVersion } from "@/utils/request/api-clients/datasets";

import { updateDatasetVersion } from "@/app/actions/datasetVersion";

import PageHeading from "@/components/page-heading/PageHeading";
import VersionForm from "@/components/form/version/VersionForm";
import { Panel } from "@/components/design-system/DesignSystem";

export default async function EditVersion({ params }) {
    const { id, editionID, versionID } = await params;
    const accessToken = await getAccessTokenFromCookie(cookies);
    const versionResp = await getVersion(id, editionID, versionID, accessToken);

    if (versionResp.error) {
        return (
            <Panel title="Error" variant="error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const version = versionResp?.response?.current || versionResp?.response?.next || versionResp.response;

    return (
        <>
            <PageHeading 
                title={`Edit version ${versionID}`}
            /> 
            <VersionForm datasetID={id} editionID={editionID} version={version} isNewVersion={false} action={updateDatasetVersion} accessToken={accessToken} />
        </>
    );
}