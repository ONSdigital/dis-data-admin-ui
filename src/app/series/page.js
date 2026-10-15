import { cookies } from "next/headers";

import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { getDatasetsList } from "@/utils/request/api-clients/datasets";

import SuccessPanel from "@/components/success-panel/SuccessPanel";
import List from "@/components/list/List";
import Pagination from "@/components/pagination/Pagination";
import SeriesListForm from "@/components/form/series-list/SeriesListForm";
import LinkButton from "@/components/link-button/LinkButton";
import { Panel, Select } from "@/components/design-system/DesignSystem";

import { mapListItems } from "./mapper";

export default async function Series({ searchParams }) {
    const accessToken = await getAccessTokenFromCookie(cookies);

    const pageParams = await searchParams;
    const query = {
        limit: 20,
        offset: Number(pageParams.offset) || 0,
        id: pageParams.id || "",
    };

    const urlParams = createURLParams(query);
    const dataList = await getDatasetsList(urlParams, accessToken);

    const listItems = [];
    const [ datasetFetchError, noSearchResults ] = checkErrors(dataList, query);
    if (!datasetFetchError && !noSearchResults) {
        listItems.push(...mapListItems(dataList?.response?.items));
    }

    const totalCount = dataList.response?.total_count;
    const totalNumberOfPages = Math.ceil(totalCount/query.limit);
    const currentPage = Math.floor(query.offset ? (query.offset / query.limit) + 1 : 1);

    const renderErrorPanel = () => {
        return (
            <Panel title="Error" variant="error">
                <p>There was an issue retrieving the list of dataset series. Refresh the page to try again.</p>
            </Panel>
        );
    };

    const renderListArea = () => {
        return (
            <>
                <div className="ons-u-bb">
                    <div className="ons-grid ons-u-mb-m">
                        <div className="ons-grid__col ons-col-8@m ons-u-fs-m ons-u-mt-s">
                            <p>
                                {noSearchResults 
                                    ? `No results found for ${query.id}` 
                                    : `Showing ${dataList.response?.offset + 1} to ${dataList.response?.offset + dataList.response?.count} of ${totalCount} series`
                                }
                            </p>
                        </div>
                        <div className="ons-grid__col ons-col-2@m ons-push-1@m">
                            <LinkButton
                                text="Create new series"
                                link="series/create"          
                            />   
                        </div>
                    </div>
                </div>
                {!noSearchResults && (
                    <>
                        <div className="ons-u-mt-m ons-u-mb-l">
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
                            limit = {query.limit}
                            currentParams = {pageParams}
                        />
                    </>
                )}
            </>
        );
    };

    return (
        <>
            {!datasetFetchError ?
                <>
                    <SuccessPanel query={pageParams} contentType="Item" />
                    <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                        <div className="ons-grid__col ons-col-4@m ons-u-pr-m">
                            <SeriesListForm key={query.id} datasetID={query.id} />
                        </div>
                        <div className="ons-grid__col ons-col-8@m">
                            { renderListArea() }
                        </div>
                    </div>
                </>
                : renderErrorPanel()
            }
        </>
    );
}

// return errors based on request response
const checkErrors = (dataList, params) => {
    if (dataList.error) {
        // if we get a 404 and there's a dataset id param 
        // assume the search has returned zero results
        if (dataList.status === 404 && params.id) {
            return [false, true];
        }
    return [true, false];
    }
return [false, false];
};

// build URL (with various params) to make request to dataset-api
const createURLParams = ({ limit, offset, id }) => {
    const query = {
        type: "static",
        sort_order: "ASC",
        limit,
        id,
        offset,
    };
    return new URLSearchParams(
        Object.entries(query).filter(([, value]) => value)
    ).toString();
};