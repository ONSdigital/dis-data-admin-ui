import { cookies } from "next/headers";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import SeriesForm from "@/components/form/series/SeriesForm";
import { createDatasetSeries } from "@/app/actions/datasetSeries";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

export default async function createPage() {

    const reqCfg = await SSRequestConfig(cookies);
    const response = await httpGet(reqCfg, "/topics");

    if(Object.keys(response).length === 0){
        return(
            <>
                <Panel title="Topics service error" variant="error">
                    <p>There was a problem connecting to the topics api which is required for this form. Please try again later.</p>
                </Panel>
            </>
        );
    } else {
        const listOfAllTopics = response.items;
        return (
            <>
                <PageHeading 
                    title="Create new dataset series"
                />
                <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                    <p>You must fill in all fields unless marked optional</p>
                </Panel>
                <SeriesForm 
                    listOfAllTopics={listOfAllTopics} 
                    action={createDatasetSeries}
                />
            </>
        );
    }
}
