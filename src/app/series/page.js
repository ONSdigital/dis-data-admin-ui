import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import Hero from "@/components/hero/Hero";
import Panel from "@/components/panel/Panel";
import List from "@/components/list/List";
import Pagination from "@/components/pagination/Pagination";
import SeriesListForm from "@/components/form/series-list/SeriesListForm";
import { mapListItems } from "./mapper";

export default async function Series({ searchParams }) {
    const reqCfg = await SSRequestConfig(cookies);

    const pageParams = await searchParams;
    pageParams.limit = 20;

    const requestURL = generateRequestURL(pageParams);
    const data = await httpGet(reqCfg, requestURL);

    let datasetFetchError = false;
    const listItems = [];
    if (data.ok != null && !data.ok) {
        datasetFetchError = true;
    } else {
        listItems.push(...mapListItems(data.items));
    }

    const totalNumberOfPages = Math.ceil(data.total_count / pageParams.limit);
    const currentPage = Math.floor(pageParams.offset ? (pageParams.offset / pageParams.limit) + 1 : 1);

    const renderErrorPanel = () => {
        return (
            <Panel title="Error" variant="error">
                <p>There was an issue retrieving the list of dataset series. Refresh the page to try again.</p>
            </Panel>
        )
    }

    return (
        <>
            {!datasetFetchError ?
                <>
                    <Hero hyperLink={{ text: "Add new dataset series", url: "series/create" }} title="Dataset series" wide />
                    <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                        <div className="ons-grid__col ons-col-4@m ons-grid--gutterless">
                            <SeriesListForm datasetID={pageParams.id} />
                        </div>
                        <div className="ons-grid__col ons-col-8@m">
                            <List items={listItems} type="series" />
                            <Pagination
                                totalNumberOfPages={totalNumberOfPages}
                                currentPage={currentPage}
                                limit={pageParams.limit}
                            />
                        </div>
                    </div>
                </>
                : renderErrorPanel()
            }

        </>
    );
}

const generateRequestURL = (params) => {
    let url = `/datasets?type=static&sort_order=ASC&limit=${params.limit}`;
    if (params.id && params.id.length > 0) {
        url = `${url}&id=${params.id}`;
    }

    if (params.offset) {
        url = `${url}&offset=${params.offset}`;
    }
    return url;
}