import { cookies, headers } from "next/headers";
import Link from "next/link";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { formatDate } from "@/utils/datetime/datetime";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { Panel, Summary } from "@/components/design-system/DesignSystem";
import SuccessPanel from "@/components/success-panel/SuccessPanel";
import LinkButton from "@/components/link-button/LinkButton";
import PageHeading from "@/components/page-heading/PageHeading";

import { mapVersionSummary } from "@/components/design-system/summary-mapper";
import { mapQualityDesignationToUserFriendlyString } from "./mapper";

export default async function Version({ params, searchParams }) {
    const { id, editionID, versionID } = await params;
    const reqCfg = await SSRequestConfig(cookies);
    const metadata = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions/${versionID}/metadata`);

    let metadataError = false;
    if (metadata.ok != null && !metadata.ok) {
        metadataError = true;
    }

    if (metadataError) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const query = await searchParams;
    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, metadata.title, metadata.edition_title);
    const versionSummary = mapVersionSummary(metadata, "hello")

    return (
        <>
            <SuccessPanel query={query} contentType="Dataset version" />
            <PageHeading 
                subtitle="Version"
                title={`Version: ${versionID}`} 
                buttonURL={`./create?edition_title=${metadata.edition_title}`}
                buttonText="Create new version" 
                linkURL="../"
                linkText="Back to edition overview"
                breadcrumbs={breadcrumbs}
            />  
            
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-8@m ">
                    <Summary summaries={versionSummary} />
                    {metadata.state !== "published" && (
                        <LinkButton
                            dataTestId="delete-version-button"
                            text="Delete version"
                            iconType="DeleteIcon"
                            iconPosition="before"
                            link={`/series/${id}/editions/${editionID}/versions/${versionID}/delete`}
                            variants={["secondary"]}
                            classes="ons-u-mt-l"
                        />
                    )}
                </div>
            </div>
        </>
    );
}
