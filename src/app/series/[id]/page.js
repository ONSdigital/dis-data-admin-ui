import { cookies } from "next/headers";
import { pathname } from "next-extra/pathname";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import List from "@/components/list/List";
import { Panel, Summary } from "@/components/design-system/DesignSystem";
import CreateEditSuccess from "@/components/create-edit-success/CreateEditSuccess";
import PageHeading from "@/components/page-heading/PageHeading";

import { mapListItems } from "./mapper";
import { mapSeriesSummary } from "@/components/design-system/summary-mapper";
import { convertTopicIDsToTopicTitles } from "@/utils/topics/topics";

export default async function Dataset({ params, searchParams }) {
    const { id } = await params;
    const query = await searchParams;

    const reqCfg = await SSRequestConfig(cookies);
    let datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
    let editions = await httpGet(reqCfg, `/datasets/${id}/editions`);

    let datasetError, editionsError = false;
    const listItems = [];
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (editions.ok != null && !editions.ok) {
        editionsError = true;
    } else {
        listItems.push(...mapListItems(editions.items, id));
    }

    const renderEditionsList = () => {
        // if no error, or 404 error because we assume 404 means no editions exist yet
        if (!editionsError || (editionsError && editions.status === 404)) {
            return (
                <>
                    <h2 className="ons-u-mt-m@xxs@m">Available editions</h2>
                    <List items={listItems} noResultsText="There are no available editions for this series"></List>
                </>
            );
        }

        return (
            <Panel title="Error" variant="error"><p>There was an issue retrieving the list of editions for this dataset. Try refreshing the page.</p></Panel>
        );
    };

    const createURL = `${id}/editions/create`;
    const editURL = `/data-admin/series/${id}/edit`;
    const dataset = datasetResp?.next || datasetResp?.current || datasetResp;
    const topicTitles = await convertTopicIDsToTopicTitles(dataset.topics, reqCfg);
    const contentItems = mapSeriesSummary(dataset, editURL, topicTitles);
    const currentURL = await pathname();
    const breadcrumbs = generateBreadcrumb(currentURL, dataset.title, null);

    if (datasetError) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    return (
        <>
            <CreateEditSuccess query={query} message="Dataset series saved" />
            <PageHeading 
                subtitle="Series"
                title={dataset.title} 
                buttonURL={createURL} 
                buttonText="Create new edition" 
                linkURL="/series" 
                linkText="Back to dataset series list"
                breadcrumbs={breadcrumbs}
            />        
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-4@m">
                    { renderEditionsList() }
                </div>
                <div className="ons-grid__col ons-col-7@m ons-push-1@m">
                    <Summary summaries={contentItems} />
                </div>
            </div>
        </>
    );
}
