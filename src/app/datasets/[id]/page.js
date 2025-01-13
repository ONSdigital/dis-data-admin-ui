import { cookies } from "next/headers";

import request from "@/utils/request/request";

import List from "../../../components/list/List"
import { mapListItems } from './mapper';

export default async function Dataset({ params }) {
    const baseURL = process.env.API_ROUTER_URL;
    const cookieStore = await cookies();
    const authToken =  cookieStore.get("access_token");
    const reqCfg = {baseURL: baseURL, authToken: authToken.value};

    const { id } = await params
    let dataset = await request(reqCfg, `/datasets/${id}`)
    let editions = await request(reqCfg, `/datasets/${id}/editions`)

    const listItems = mapListItems(editions.items, id)
    return (
        <>
            <h1 className="ons-u-fs-xxxl">Dataset</h1>
            <div className="ons-u-fs-m ons-u-mt-s ons-u-pb-xxs" style={{"color":"#707071"}}>{dataset.title}</div>
            <p>Select an edition to view or edit.</p>
            <List items={listItems}></List>
        </>
    );
}