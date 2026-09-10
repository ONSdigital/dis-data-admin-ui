import { cookies } from "next/headers";

import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { getAllTopics } from "@/components/topics/topicsData";

import { createDatasetSeries } from "@/app/actions/datasetSeries";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import SeriesForm from "@/components/form/series/SeriesForm";

export default async function createPage() {
    const accessToken = await getAccessTokenFromCookie(cookies);
    const topics = await getAllTopics(accessToken);

    if(Object.keys(topics).length === 0){
        return(
            <>
                <Panel title="Topics service error" variant="error">
                    <p>There was a problem connecting to the topics api which is required for this form. Please try again later.</p>
                </Panel>
            </>
        );
    } else {
        return (
            <>
                <PageHeading 
                    title="Create new dataset series"
                />
                <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                    <p>You must fill in all fields unless marked optional</p>
                </Panel>
                <SeriesForm 
                    listOfAllTopics={topics} 
                    action={createDatasetSeries}
                    isPublished={false}
                    showSeriesIDField={true}
                />
            </>
        );
    }
}
