import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { updateDatasetEdition } from "@/app/actions/datasetEdition";

import Hero from "@/components/hero/Hero";
import { Panel } from "@/components/design-system/DesignSystem"
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
            <Hero hyperLink={{ text: "Back to edition overview", url: "./" }} title={ "Edit edition: " + edition.edition_title } wide />
            { !editionError ?  
                <> 
                    <EditionForm datasetID={ id } edition={ edition } isNewEdition={ false } action={ updateDatasetEdition }/>
                </>
                : renderErrorPanel()
            }
        </>
    );
}