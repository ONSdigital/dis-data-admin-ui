import { cookies, headers } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import List from "@/components/list/List";
import LinkButton from "@/components/link-button/LinkButton";
import { Panel, Summary } from "@/components/design-system/DesignSystem";
import SuccessPanel from "@/components/success-panel/SuccessPanel";
import PageHeading from "@/components/page-heading/PageHeading";

import { mapListItems } from "./mapper";
import { mapSeriesSummary } from "@/components/design-system/summary-mapper";
import { convertTopicIDsToTopicTitles } from "@/utils/topics/topics";

export default async function Dataset({ params, searchParams }) {
    const { id } = await params;
    const query = await searchParams;

    const reqCfg = await SSRequestConfig(cookies);
    const datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
    const editions = await httpGet(reqCfg, `/datasets/${id}/editions`);

    let datasetError, editionsError = false;
    const listItems = [];
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (datasetError) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
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
    const approvalLink = `${id}/publish`;
    const dataset = datasetResp?.next || datasetResp?.current || datasetResp;

    const topicTitles = await convertTopicIDsToTopicTitles(dataset.topics, reqCfg);
    const seriesSummaryItems = mapSeriesSummary(dataset, editURL, topicTitles);
    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, dataset.title, null);

    // if current is "published" and next is "associated" infer that they are unpublished changes to a series
    // if version ID's in links.latest_version are the same infer that this is only series metadata updates
    // and this needs to be published seperately and not as/with a new version which would get published via a bundle 
    const showApproveChangesMessage = datasetResp?.current?.state === "published" && datasetResp?.next?.state === "associated" && datasetResp?.current?.links?.latest_version?.id === datasetResp?.next?.links?.latest_version?.id;

    return (
        <>
            <SuccessPanel query={query} message="Dataset series saved" />
            <PageHeading 
                subtitle="Series"
                title={dataset.title} 
                buttonURL={createURL} 
                buttonText="Create new edition" 
                linkURL="/series" 
                linkText="Back to dataset series list"
                breadcrumbs={breadcrumbs}
                showApproveChangesMessage={showApproveChangesMessage}
                approvalLink={approvalLink}
            />
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-4@m">
                    { renderEditionsList() }
                </div>
                <div className="ons-grid__col ons-col-7@m ons-push-1@m">
                    <Summary summaries={seriesSummaryItems} />

                    {dataset.state !== "published" && (
                        <LinkButton
                            dataTestId="delete-series-button"
                            text="Delete series"
                            iconType="DeleteIcon"
                            iconPosition="before"
                            link={`/series/${id}/delete`}
                            variants={["secondary"]}
                            classes="ons-u-mt-l"
                        />
                    )}
                </div>
            </div>
        </>
    );
}
