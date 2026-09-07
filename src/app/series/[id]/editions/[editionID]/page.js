import { cookies, headers } from "next/headers";

import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { getDataset, getEdition, getVersionsList } from "@/utils/request/api-clients/datasets";

import PageHeading from "@/components/page-heading/PageHeading";
import List from "@/components/list/List";
import { Panel, Summary } from "@/components/design-system/DesignSystem";
import { mapEditionSummary } from "@/components/design-system/summary-mapper";
import SuccessPanel from "@/components/success-panel/SuccessPanel";

import { mapListItems } from "./mapper";

export default async function Edition({ params, searchParams }) {
    const { id, editionID } = await params;
    const query = await searchParams;
    const accessToken = await getAcessTokenFromCookie(cookies);
    const datasetResp = await getDataset(id, accessToken);
    const editionResp = await getEdition(id, editionID, accessToken);
    const versions = await getVersionsList(id, editionID, accessToken);

    if (datasetResp.error || editionResp.error) {
        return (
            <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel>
        );
    }

    const listItems = [];
    if (versions.response) {
        listItems.push(...mapListItems(versions.response?.items, id, editionID));
    }

    const renderVersionsList = () => {
        if (versions.error) {
            return (
                <Panel title="Error" variant="error"><p>There was an issue retrieving the list of versions for this dataset. Try refreshing the page.</p></Panel>
            );
        }
        return (
            <>
                <h2 className="ons-u-mt-m@xxs@m">Available versions</h2>
                <List items={listItems} noResultsText="No editions found for dataset"></List>
            </>
        );
    };

    let unpublishedVersion = false;
    versions?.response?.items?.forEach(item => {
        if (item.state !== "published") {
            unpublishedVersion = true;
        }
    });
    
    const dataset = datasetResp?.response?.current || datasetResp?.response?.next || datasetResp.response;
    const edition = editionResp?.response?.current || editionResp?.response?.next || editionResp.response;
    const createURL = `${edition.edition}/versions/create?edition_title=${edition.edition_title}`;
    const editURL = `/data-admin/series/${id}/editions/${editionID}/edit`;
    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, dataset.title, edition.edition_title);
    const editionSummaryItems = mapEditionSummary(edition, editURL);

    return (
        <>
            <SuccessPanel query={query} contentType="Dataset edition" />
            <PageHeading 
                subtitle="Edition"
                title={dataset.title + ": " + edition.edition_title} 
                buttonURL={createURL} 
                buttonText="Create new version" 
                linkURL="../"
                linkText="Back to series overview"
                breadcrumbs={breadcrumbs}
                showPanel={unpublishedVersion}
                panelText="An unpublished version exists so cannot add new dataset version."
                disableButton={unpublishedVersion}
            /> 
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-4@m">
                    { renderVersionsList() }
                </div>
                <div className="ons-grid__col ons-col-7@m ons-push-1@m">
                    <Summary summaries={editionSummaryItems} />
                </div>
            </div>
        </>
    );
}