import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import List from "@/components/list/List";
import LinkButton from "@/components/link-button/LinkButton";
import Panel from "@/components/panel/Panel";
import Pagination  from "@/components/pagination/Pagination";
import Select from "@/components/select/Select";
import { mapListItems } from "./mapper";

export default async function Series({searchParams}) {
    const reqCfg = await SSRequestConfig(cookies);

    const pageParams = await searchParams;
    if (Object.keys(pageParams).length === 0){
        pageParams.limit = 20;
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

    const totalCount = data.total_count
    const totalNumberOfPages = Math.ceil(totalCount/pageParams.limit);
    const currentPage = Math.floor(pageParams.offset ? (pageParams.offset / pageParams.limit) + 1 : 1);

    return (
        <>
            { error ? <Panel title="Error" variant="error">
                    <p>
                        There was an issue retrieving the list of dataset series.
                    </p>
                </Panel> : ""}
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-4@m ons-u-pr-m" style={{backgroundColor: "#bcbcbd", textAlign: "center", fontWeight: "bold", height: "100vh"}}>
                    FILTER
                </div>
                <div className="ons-grid__col ons-col-8@m">
                    <div className="ons-u-bb">
                        <div className="ons-grid ons-u-mb-xl">
                                <div className="ons-grid__col ons-col-8@m ons-u-fs-m ons-u-mt-s">
                                    Showing {data.offset + 1} to {data.offset + data.count} of {totalCount} series
                                </div>
                                <div className="ons-grid__col ons-col-2@m ons-push-1@m">
                                    <LinkButton
                                        text="Create new series"
                                        link="series/create"          
                                    />   
                                </div>
                        </div>
                    </div>
                    <div className="ons-u-mt-xl ons-u-mb-xl">
                        <Select
                            classes="ons-u-ml-m"
                            dataTestId="select-series-sort-by"
                            id="select-series-sort-by"
                            label={{
                                for: 'select-series-sort-by',
                                text: 'Sort By:'
                            }}
                            options={[
                                {
                                text: 'Series ID',
                                value: 'seriesID'
                                }
                            ]}
                            variants="inline"
                        />
                    </div>
                    <List items={listItems} type="series"/>
                    <Pagination
                        totalNumberOfPages = {totalNumberOfPages}
                        currentPage = {currentPage}
                        limit = {pageParams.limit}
                    />
                </div>
            </div>
        </>
    );
}