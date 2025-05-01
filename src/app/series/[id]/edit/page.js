import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { updateDatasetSeries } from "@/app/actions/datasetSeries"

import Panel from "@/components/panel/Panel";
import SeriesForm from "@/components/form/series/SeriesForm"

export default async function createPage({params}) {
    const { id } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const topicsResponse = await httpGet(reqCfg, "/topics");
    const response = await httpGet(reqCfg, `/datasets/${id}`);
    const dataset = response.next

    if(Object.keys(topicsResponse).length === 0){
        return(
            <>
                <Panel title="Topics service error" variant="error">
                    <p>There was a problem connecting to the topics api which is required for this form. Please try again later.</p>
                </Panel>
            </>
        )
    } else {
        const listOfAllTopics = response.items
        return (
            <>
                <SeriesForm 
                    currentTitle={dataset.title} 
                    currentID={dataset.id} 
                    currentDescription={dataset.description} 
                    currentContacts={dataset.contacts}
                    currentTopics={dataset.topics}
                    listOfAllTopics={listOfAllTopics}
                    action={updateDatasetSeries}
                />
            </>
        );
    }
}
