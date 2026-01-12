import { cookies, headers } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";


export default async function PublishDataset({ params }) {
    const { id } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const datasetResp = await httpGet(reqCfg, `/datasets/${id}`);

    let datasetError = false;
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    const dataset = datasetResp?.next || datasetResp?.current || datasetResp;
    const seriesIsPublishable = datasetResp?.current?.state === "published" && datasetResp?.next?.state === "associated" && datasetResp?.current?.links?.latest_version?.id === datasetResp?.next?.links?.latest_version?.id;

    if (datasetError) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    if (!seriesIsPublishable) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-not-publishable">
                <p>There doesn't appear to be any changes to this series that are publishable.</p>
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
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-12@m">
                    <h1 className="ons-u-fs-xl ons-u-mb-m">{`Are you sure you want to publish '${dataset.title}'?`}</h1>
                    <p>Publishing this series will push any changes to the live website.</p>

                </div>
            </div>
        </>
    );
}
