import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { createDatasetSeries } from "@/app/actions/datasetSeries"

import SeriesForm from "@/components/form/series/SeriesForm"

export default async function createPage() {

    const reqCfg = await SSRequestConfig(cookies);
    const response = await httpGet(reqCfg, "/topics");
    const listOfAllTopics = response.items

    return (
        <>
            <SeriesForm 
                listOfAllTopics={listOfAllTopics} 
                action={createDatasetSeries}
            />
        </>
    );
}
