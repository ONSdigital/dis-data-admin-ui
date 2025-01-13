import { cookies } from "next/headers";

import request from "@/utils/request/request"

import List from "../../../../../components/list/List"
import { mapListItems } from "./mapper"


export default async function Dataset({ params }) {
    const baseURL = process.env.API_ROUTER_URL;
    const cookieStore = await cookies();
    const authToken =  cookieStore.get("access_token");
    const reqCfg = {baseURL: baseURL, authToken: authToken.value};

    const { id, editionID } = await params
    let dataset = await request(reqCfg, `/datasets/${id}`)
    let edition = await request(reqCfg, `/datasets/${id}/editions/${editionID}`)
    let versions = await request(reqCfg, `/datasets/${id}/editions/${editionID}/versions`)

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