import { cookies } from "next/headers";
import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { getDataset } from "@/utils/request/api-clients/datasets";

import { updateDatasetSeries } from "@/app/actions/datasetSeries";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import SeriesForm from "@/components/form/series/SeriesForm";
import { getAllTopics } from "@/components/topics/topicsData";

export default async function createPage({params}) {
    const { id } = await params;

    const accessToken = await getAcessTokenFromCookie(cookies);
    const topics = await getAllTopics(accessToken);
    const datasetResp = await getDataset(id, accessToken);

    let topicsError = false;
    if(Object.keys(topics).length === 0) {
        topicsError = true;
    }

    if (datasetResp.error) {
        return (
            <>
                <Panel title="Error" variant="error">
                    <p>There was a problem retreiving data for this page. Please try again later.</p>
                </Panel>
            </>
        );
    }

    if (topicsError) {
        return (
            <>
                <Panel title="Topics service error" variant="error">
                    <p>There was a problem connecting to the topics API which is required for this form. Please try again later.</p>
                </Panel>
            </>
        );
    }

    const dataset = datasetResp?.response?.next || datasetResp?.response?.current || datasetResp?.response;
    const isPublished = datasetResp?.response?.current?.state === "published";
    const showSeriesIDField = !isPublished && !dataset?.is_migration;

    return (
        <>
            <PageHeading 
                title="Edit dataset series"
            />
            <SeriesForm 
                currentTitle={dataset.title} 
                currentID={dataset.id} 
                currentDescription={dataset.description} 
                currentTopics={dataset.topics}
                currentNextRelease={dataset.next_release}
                currentQMI={dataset.qmi?.href}
                currentKeywords={dataset.keywords}
                currentContacts={dataset.contacts}
                listOfAllTopics={topics}
                isPublished={isPublished}
                showSeriesIDField={showSeriesIDField}
                action={updateDatasetSeries.bind(null, id)}
            />
        </>
    );
}
