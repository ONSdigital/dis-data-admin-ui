import { cookies, headers } from "next/headers";

import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { getDataset, getEditionsList } from "@/utils/request/api-clients/datasets";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import List from "@/components/list/List";
import LinkButton from "@/components/link-button/LinkButton";
import { Panel, Summary } from "@/components/design-system/DesignSystem";
import SuccessPanel from "@/components/success-panel/SuccessPanel";
import PageHeading from "@/components/page-heading/PageHeading";

import { mapListItems } from "./mapper";
import { mapSeriesSummary } from "@/components/design-system/summary-mapper";
import { convertTopicIDsToTopicTitles } from "@/utils/topics/topics";
import { HEADER_USER_ROLES, userIsAdmin } from "@/utils/auth/auth";

export default async function Dataset({ params, searchParams }) {
    const { id } = await params;
    const query = await searchParams;

    const accessToken = await getAcessTokenFromCookie(cookies);
    const datasetResp = await getDataset(id, accessToken);
    const editions = await getEditionsList(id, accessToken);

    if (datasetResp.error) {
        return (
            <Panel title="Error" variant="error" dataTestId="dataset-series-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const listItems = [];
    if (editions.response) {
        listItems.push(...mapListItems(editions.response.items, id));
    }

    const renderEditionsList = () => {
        // if no error, or 404 error because we assume 404 means no editions exist yet
        if (!editions.error || (editions.error && editions.status === 404)) {
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
    const editURL = `${id}/edit`;
    const publishLink = `${id}/publish`;
    const dataset = datasetResp?.response?.next || datasetResp?.response?.current || datasetResp?.response;

    const topicTitles = await convertTopicIDsToTopicTitles(dataset.topics, accessToken);
    const isPublished = datasetResp?.response?.current?.state === "published";
    const seriesSummaryItems = mapSeriesSummary(dataset, editURL, topicTitles, isPublished);
    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, dataset.title, null);
    const userRoles = (await headers()).get(HEADER_USER_ROLES);
    const isAdmin = userIsAdmin(userRoles);

    // if current is "published" and next is "associated" infer that they are unpublished changes to a series
    const showPublishChangesMessage = datasetResp?.response?.current?.state === "published" && datasetResp?.response?.next?.state === "associated";

    const deleteLink = `/series/${id}/delete?seriesTitle=${dataset.title}`;

    return (
        <>
            <SuccessPanel query={query} contentType={"Dataset series"}/>
            <PageHeading 
                subtitle="Series"
                title={dataset.title} 
                buttonURL={createURL} 
                buttonText="Create new edition" 
                linkURL="/series" 
                linkText="Back to dataset series list"
                breadcrumbs={breadcrumbs}
                showPublishChangesMessage={showPublishChangesMessage}
                showPublishChangesButton={isAdmin}
                publishLink={publishLink}
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
