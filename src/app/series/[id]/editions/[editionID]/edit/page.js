import { cookies } from "next/headers";

import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { getEdition } from "@/utils/request/api-clients/datasets";
import { updateDatasetEdition } from "@/app/actions/datasetEdition";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import EditionForm from "@/components/form/edition/EditionForm";


export default async function EditEdition({ params }) {
    const { id, editionID } = await params;
    const accessToken = await getAccessTokenFromCookie(cookies);
    const editionResp = await getEdition(id, editionID, accessToken);

    if (editionResp.error) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-edition-response-error">
                <p>There was a problem retreiving data for this page. Please try again later.</p>
            </Panel>
        );
    }

    const edition = editionResp?.response?.current || editionResp?.response?.next || editionResp.response;
    const showEditionIDField = edition?.state !== "published" && !edition?.is_migration;
    return (
        <>
            <PageHeading 
                title={"Edit edition: " + edition.edition_title}
            /> 
            <> 
                <EditionForm datasetID={ id } edition={ edition } isNewEdition={ false } showEditionIDField={showEditionIDField} action={ updateDatasetEdition } accessToken={accessToken}/>
            </>
        </>
    );
}