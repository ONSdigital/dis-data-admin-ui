import { cookies, headers } from "next/headers";

import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { getMetadata } from "@/utils/request/api-clients/datasets";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { Panel, Summary } from "@/components/design-system/DesignSystem";
import SuccessPanel from "@/components/success-panel/SuccessPanel";
import LinkButton from "@/components/link-button/LinkButton";
import PageHeading from "@/components/page-heading/PageHeading";

import { mapVersionSummary } from "@/components/design-system/summary-mapper";

export default async function Version({ params, searchParams }) {
    const { id, editionID, versionID } = await params;
    const accessToken = await getAccessTokenFromCookie(cookies);
    const metadata = await getMetadata(id, editionID, versionID, accessToken);

    if (metadata.error) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const query = await searchParams;
    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, metadata.response?.title, metadata.response?.edition_title);
    const editURL = `/data-admin/series/${id}/editions/${editionID}/versions/${versionID}/edit`;
    const versionSummary = mapVersionSummary(metadata.response, editURL);

    const deleteLink = `/series/${id}/editions/${editionID}/versions/${versionID}/delete?seriesTitle=${metadata.response?.title}&editionTitle=${metadata.response?.edition_title}`;

    return (
        <>
            <SuccessPanel query={query} contentType="Dataset version" />
            <PageHeading 
                subtitle="Version"
                title={`Version: ${versionID}`} 
                buttonURL={`./create?edition_title=${metadata.response?.edition_title}`}
                buttonText="Create new version" 
                linkURL="../"
                linkText="Back to edition overview"
                breadcrumbs={breadcrumbs}
            />  
            
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-8@m ">
                    <Summary summaries={versionSummary} />
                    {metadata.response?.state !== "published" && (
                        <LinkButton
                            dataTestId="delete-version-button"
                            text="Delete version"
                            iconType="DeleteIcon"
                            iconPosition="before"
                            link={deleteLink}
                            variants={["secondary"]}
                            classes="ons-u-mt-l"
                        />
                    )}
                </div>
            </div>
        </>
    );
}
