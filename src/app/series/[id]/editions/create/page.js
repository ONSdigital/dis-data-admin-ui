import { cookies } from "next/headers";

import { createDatasetEdition } from "@/app/actions/datasetEdition";
import { getAccessTokenFromCookie } from "@/utils/auth/auth";

import { Panel } from "@/components/design-system/DesignSystem";
import EditionForm from "@/components/form/edition/EditionForm";
import PageHeading from "@/components/page-heading/PageHeading";

export default async function CreateEditionPage({ params }) {
    const { id } = await params;
    const accessToken = getAccessTokenFromCookie(cookies);

    return (
        <>
            <PageHeading 
                title={`Create new edition`}
                subtitle={id}
            /> 
            <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                <p>You must fill in all fields unless marked optional</p>
            </Panel>
            <EditionForm datasetID={id} isNewEdition={true} showEditionIDField={true} action={createDatasetEdition} accessToken={accessToken}/>
        </>
    );
}
