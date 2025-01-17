import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import List from "../../../../../components/list/List"
import { mapListItems } from "./mapper"


export default async function Dataset({ params }) {
    const reqCfg = await SSRequestConfig(cookies);

    const { id, editionID } = await params
    let dataset = await httpGet(reqCfg, `/datasets/${id}`)
    let edition = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}`)
    let versions = await httpGet(reqCfg, `/datasets/${id}/editions/${editionID}/versions`)

    const listItems = mapListItems(versions.items, id, editionID)
    return (
        <>
            <div className="ons-u-fs-m ons-u-mt-s ons-u-pb-xxs" style={{"color":"#707071"}}>Edition </div>
            <h1 className="ons-u-fs-xxxl">{dataset.title}: {edition.edition}</h1>
            <p>Select a version to view or edit.</p>
            <List items={listItems} />
        </>
    );
}