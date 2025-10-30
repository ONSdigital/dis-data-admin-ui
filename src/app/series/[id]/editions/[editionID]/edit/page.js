import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { updateDatasetEdition } from "@/app/actions/datasetEdition";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import EditionForm from "@/components/form/edition/EditionForm";


export default async function EditEdition({ params }) {
    const reqCfg = await SSRequestConfig(cookies);

    const { id, editionID } = await params;
    let editionResp = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}`);

    let editionError = false;
    if (editionResp.ok != null && !editionResp.ok) {
        editionError = true;
    }

    const renderErrorPanel = () => {
        return (
            <>
                <Panel title="Error" variant="error">
                    <p>There was a problem retreiving data for this page. Please try again later.</p>
                </Panel>
            </>
        );
    };

    const edition = editionResp?.current || editionResp?.next || editionResp;
    return (
        <>
            <PageHeading 
                title={"Edit edition: " + edition.edition_title}
            /> 
            { !editionError ?  
                <> 
                    <EditionForm datasetID={ id } edition={ edition } isNewEdition={ false } showEditionIDField={edition?.state === "published"} action={ updateDatasetEdition }/>
                </>
                : renderErrorPanel()
            }
        </>
    );
}