import { cookies } from "next/headers";

import { getAccessTokenFromCookie } from "@/utils/auth/auth";
import { getMigrationsList } from "@/utils/request/api-clients/migration";

import MigrationFilter from "@/components/form/migration-list-filter/MigrationFilter";
import { Panel } from "@/components/design-system/DesignSystem";
import LinkButton from "@/components/link-button/LinkButton";
import Table from "@/components/table/Table";
import Pagination from "@/components/pagination/Pagination";
import SuccessPanel from "@/components/success-panel/SuccessPanel";

import { mapMigrationListTable } from "@/components/table/mapper";

export default async function MigrationList({ searchParams }) {
    const pageParams = await searchParams;
    pageParams.limit = pageParams.limit ? Number(pageParams.limit) : 10;
    pageParams.offset = pageParams.offset ? Number(pageParams.offset) : 0;

    const requestURL = createRequestURL(pageParams);
    const accessToken = await getAccessTokenFromCookie(cookies);
    const migrationsResp = await getMigrationsList(requestURL, accessToken);

    if (migrationsResp.error) {
        return (
            <Panel title="Error" variant="error" dataTestId="migrations-list-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }
    const mappedTable = mapMigrationListTable(migrationsResp.response?.items);

    const totalCount = migrationsResp.response?.total_count;
    const totalNumberOfPages = Math.ceil(totalCount / pageParams.limit);
    const currentPage = Math.floor(pageParams.offset ? (pageParams.offset / pageParams.limit) + 1 : 1);

    const renderListArea = () => {
        return (
            <>
                <div className="ons-u-bb">
                    <div className="ons-grid ons-u-mb-m">
                        <div className="ons-grid__col ons-col-8@m ons-u-fs-m ons-u-mt-s">
                            Showing {migrationsResp.response?.offset + 1} to {migrationsResp.response?.offset + migrationsResp.response?.count} of {migrationsResp.response?.total_count} jobs
                        </div>
                        <div className="ons-grid__col ons-col-4@m">
                            <LinkButton
                                dataTestId="create-migration-job-button"
                                text="Create migration job"
                                link="migration/create"
                                classes="ons-u-fr"
                            />
                        </div>
                    </div>
                </div>
                <Table contents={mappedTable} classes="ons-u-mt-m" dataTestId="migration-list-table" sortBy={pageParams.sort}/>                
                <Pagination
                    totalNumberOfPages={totalNumberOfPages}
                    currentPage={currentPage}
                    limit={pageParams.limit}
                />
            </>
        );
    };
    return (
        <>
            <SuccessPanel query={pageParams} contentType={pageParams.series} />
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-4@m ons-u-pr-m">
                    <MigrationFilter states={migrationsResp.response?.states}></MigrationFilter>
                </div>
                <div className="ons-grid__col ons-col-8@m">
                    {renderListArea()}
                </div>
            </div>
        </>
    );
}

const createRequestURL = (params) => {
    let url = `limit=${params.limit}&sort=job_number:desc`;

    if (params.state) {
        url = `${url}&state=${params.state}`;
    }

    if (params.offset) {
        url = `${url}&offset=${params.offset}`;
    }

    return url;
};
