import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import Hero from "@/components/hero/Hero";
import Panel from "@/components/panel/Panel";
import List from "@/components/list/List";
import Pagination  from "@/components/pagination/Pagination";
import { mapListItems } from "./mapper";

export default async function Series({searchParams}) {
    const reqCfg = await SSRequestConfig(cookies);

    const pageParams = await searchParams;
    if (Object.keys(pageParams).length === 0){
        pageParams.limit = 25;
    }

    const url = "/datasets?type=static&sort_order=ASC&limit=" + pageParams.limit + (pageParams.offset ? "&offset=" + pageParams.offset : "");
    const data = await httpGet(reqCfg, url);

    let error = false;
    const listItems = [];
    if (data.ok != null && !data.ok) {
        error = true;
    } else {
        listItems.push(...mapListItems(data.items));
    }

    const totalNumberOfPages = Math.ceil(data.total_count/pageParams.limit);
    const currentPage = Math.floor(pageParams.offset ? (pageParams.offset / pageParams.limit) + 1 : 1);
    
    return (
        <>
            { error ? <Panel title="Error" variant="error">
                    <p>
                        There was an issue retrieving the list of dataset series.
                    </p>
                </Panel> : ""}
            <div className="ons-u-mt-l ons-u-mb-l">
                <List items={listItems} type="series"/>
                <Pagination
                    totalNumberOfPages = {totalNumberOfPages}
                    currentPage = {currentPage}
                    limit = {pageParams.limit}
                />
            </div>
        </>
    );
}