import { cookies, headers } from "next/headers";

import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { getDataset } from "@/utils/request/api-clients/datasets";

import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { publishAction } from "@/app/actions/publish";

import { Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";
import PublishForm from "@/components/form/publish/PublishForm";


export default async function PublishDataset({ params }) {
    const { id } = await params;

    const accessToken = await getAcessTokenFromCookie(cookies);
    const datasetResp = await getDataset(id, accessToken);

    if (datasetResp.error) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const dataset = datasetResp?.response?.next || datasetResp?.response?.current || datasetResp?.response;
    const seriesIsPublishable = datasetResp?.response?.current?.state === "published" && datasetResp?.response?.next?.state === "associated";

    if (!seriesIsPublishable) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-not-publishable">
                <p>{"There doesn't appear to be any changes to this series that are publishable."}</p>
            </Panel>
        );
    }

    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, dataset.title, null);

    return (
        <>
            <PageHeading 
                breadcrumbs={breadcrumbs}
            />        
            <div className="ons-grid ons-u-mt-l">
                <div className="ons-grid__col ons-col-12@m">
                    <PublishForm action={publishAction} dataset={dataset} cancelLink="./"/>
                </div>
            </div>
        </>
    );
}
