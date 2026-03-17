import { cookies } from "next/headers";

import { createDatasetEdition } from "@/app/actions/datasetEdition";
import { SSRequestConfig } from "@/utils/request/request";

import { Panel } from "@/components/design-system/DesignSystem";
import EditionForm from "@/components/form/edition/EditionForm";
import PageHeading from "@/components/page-heading/PageHeading";

export default async function CreateEditionPage({ params }) {
    const { id } = await params;
    const reqCfg = await SSRequestConfig(cookies);
    const accessToken = reqCfg.authToken;

    return (
        <>
            <PageHeading 
                title={`Create new edition`}
                subtitle={id}
            /> 
            <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                <p>You must fill in all fields unless marked optional</p>
            </Panel>
            <EditionForm datasetID={id} isNewEdition={true} action={createDatasetEdition} accessToken={accessToken}/>
        </>
    );
}
