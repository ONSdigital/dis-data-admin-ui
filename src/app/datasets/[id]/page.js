import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import List from "../../../components/list/List";
import { mapListItems } from './mapper';

export default async function Dataset({ params }) {
    const reqCfg = await SSRequestConfig(cookies);

    const { id } = await params;
    let dataset = await httpGet(reqCfg, `/datasets/${id}`);
    let editions = await httpGet(reqCfg, `/datasets/${id}/editions`);

    const listItems = mapListItems(editions.items, id);
    return (
        <>
            <h1 className="ons-u-fs-xxxl">Dataset</h1>
            <div className="ons-u-fs-m ons-u-mt-s ons-u-pb-xxs" style={{"color":"#707071"}}>{dataset.title}</div>
            <p>Select an edition to view or edit.</p>
            <List items={listItems}></List>
        </>
    );
}