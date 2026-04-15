import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { Panel } from "@/components/design-system/DesignSystem";

import LinkButton from "@/components/link-button/LinkButton";
import Table from "@/components/table/Table";
import  MigrationFilter  from "@/components/form/migration-list-filter/MigrationFilter"

import { mapMigrationListTable } from "@/components/table/mapper";

export default async function MigrationList({ searchParams }) {    
    const pageParams = await searchParams;
    const requestURL = createRequestURL(pageParams);
    const reqCfg = await SSRequestConfig(cookies, "migration-service");
    const migrationsResp = await httpGet(reqCfg, requestURL);

    let migrationsRespError = false;
    if (migrationsResp.ok != null && !migrationsResp.ok) {
        migrationsRespError = true;
    }

    if (migrationsRespError) {
        return (
            <Panel title="Error" variant="error" dataTestId="migrations-list-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }
    const mappedTable = mapMigrationListTable(migrationsResp.items);
    const renderListArea = () => {
        return (
            <>
                <div className="ons-u-bb">
                    <div className="ons-grid ons-u-mb-m">
                        <div className="ons-grid__col ons-col-8@m ons-u-fs-m ons-u-mt-s">
                            Showing 1 to {migrationsResp.count} of {migrationsResp.total_count} jobs
                        </div>
                        <div className="ons-grid__col ons-col-2@m ons-push-1@m">
                            <LinkButton
                                dataTestId="create-migration-job-button"
                                text="Create migration job"
                                link="migration/create"
                            />
                        </div>
                    </div>
                </div>
                <Table contents={mappedTable} classes="ons-u-mt-m" dataTestId="migration-list-table" />
            </>
        );
    };
    const listOfStates = [...new Set(migrationsResp.items.map(item => item.state))];
    return (
        <>
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-4@m ons-u-pr-m">
                    <MigrationFilter states={listOfStates}></MigrationFilter>
                </div>
                <div className="ons-grid__col ons-col-8@m">
                    { renderListArea() }
                </div>
            </div>
        </>
    );
}

// build URL (with state params) to make request to migration-api
const createRequestURL = (params) => {
    let url  = `/migration-jobs?limit=50&sort=job_number:desc`;

    if (params.state) {
        url = `${url}&state=${params.state}`;
    }
    return url;
};
