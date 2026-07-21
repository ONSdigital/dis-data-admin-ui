import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { updateDatasetEdition } from "@/app/actions/datasetEdition";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import EditionForm from "@/components/form/edition/EditionForm";


export default async function EditEdition({ params }) {
    const reqCfg = await SSRequestConfig(cookies);
    const accessToken = reqCfg.authToken;

    const { id, editionID } = await params;
    const editionResp = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}`);

    let editionError = false;
    if (editionResp.ok != null && !editionResp.ok) {
        editionError = true;
    }

    if (editionError) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-edition-response-error">
                <p>There was a problem retreiving data for this page. Please try again later.</p>
            </Panel>
        );
    }

    const edition = editionResp?.current || editionResp?.next || editionResp;
    const showEditionIDField = edition?.state !== "published" || !edition?.is_migration;
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