import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { updateDatasetSeries } from "@/app/actions/datasetSeries"

import SeriesForm from "@/components/form/series/SeriesForm"

export default async function createPage({params}) {
    const { id } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const topicsResponse = await httpGet(reqCfg, "/topics");
    const listOfAllTopics = topicsResponse.items

    const response = await httpGet(reqCfg, `/datasets/${id}`);
    const dataset = response.next

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
