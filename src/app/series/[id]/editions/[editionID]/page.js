import { cookies } from "next/headers";
import { pathname } from "next-extra/pathname";

import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import PageHeading from "@/components/page-heading/PageHeading";
import List from "@/components/list/List";
import { Panel, Summary } from "@/components/design-system/DesignSystem";
import { mapEditionSummary } from "@/components/design-system/summary-mapper";
import SuccessPanel from "@/components/success-panel/SuccessPanel";

import { mapListItems } from "./mapper";

export default async function Edition({ params, searchParams }) {
    const reqCfg = await SSRequestConfig(cookies);

    const { id, editionID } = await params;
    const query = await searchParams;
    let datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
    let editionResp = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}`);
    let versions = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions`);

    let datasetError, editionError, versionsError = false;
    const listItems = [];
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (editionResp.ok != null && !editionResp.ok) {
        editionError = true;
    }

    if (versions.ok != null && !versions.ok) {
        versionsError = true;
    } else {
        listItems.push(...mapListItems(versions.items, id, editionID));
    }

    let unpublishedVersion = false;
    if (versions?.items) {
        versions.items.forEach(item => {
            if (item.state != "published") {
                unpublishedVersion = true;
            }
        });
    }

    const renderVersionsList = () => {
        if (versionsError) {
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

    const dataset = datasetResp?.current || datasetResp?.next || datasetResp;
    const edition = editionResp?.current || editionResp?.next || editionResp;
    const createURL = `${edition.edition}/versions/create?edition_title=${edition.edition_title}`;
    const editURL = `/data-admin/series/${id}/editions/${editionID}/edit`;
    const currentURL = await pathname();
    const breadcrumbs = generateBreadcrumb(currentURL, dataset.title, edition.edition_title);
    const editionSummaryItems = mapEditionSummary(edition, editURL);

    if (datasetError || editionError) {
        return (
            <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel>
        );
    }

    return (
        <>
            <SuccessPanel query={query} message="Dataset edition saved" />
            <PageHeading 
                subtitle="Edition"
                title={dataset.title + ": " + edition.edition_title} 
                buttonURL={createURL} 
                buttonText="Create new version" 
                linkURL="../"
                linkText="Back to dataset series list"
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