import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import List from "../../components/list/List";
import { mapListItems } from "./mapper";

export default async function Datasets() {
    const reqCfg = await SSRequestConfig(cookies);
    const data = await httpGet(reqCfg, "/datasets");
    const listItems = mapListItems(data.items);
    
    return (
        <>
            <h1 className="ons-u-fs-xxxl">Find a dataset</h1>
            <div className="ons-u-mt-l ons-u-mb-l">
                <List items={listItems}/>
            </div>
        </>
    );
}