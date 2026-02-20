import { cookies, headers } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { Panel, Summary } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";

import { mapMigrationJobSummary } from "@/components/design-system/summary-mapper";

export default async function MigrationOverview({ params }) {
    const { id } = await params;
    const reqCfg = await SSRequestConfig(cookies, "migration-service");

    const migrationResp = await httpGet(reqCfg, `/migration-jobs/${id}`);
    if (migrationResp.ok != null && !migrationResp.ok) {
        return (
            <Panel title="Error" variant="error" dataTestId="migrations-job-overview-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const displayMigrationJobDetails = migrationResp.state !== "submitted" || migrationResp.state !== "migrating";

    const renderTaskList = async() => {
        if (!displayMigrationJobDetails) {
            return (<p>Dataset series migration is still in progress. Try freshing the page.</p>);
        }

        const migrationTasksResp = await httpGet(reqCfg, `/migration-jobs/${id}/tasks?limit=50`);
        if (migrationTasksResp.ok != null && !migrationTasksResp.ok) {
            return (
                <Panel title="Error" variant="error" dataTestId="migrations-job-overview-response-error">
                    <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
                </Panel>
            );
        }
        
        const migrationTaskSummaryItems = mapMigrationJobSummary(migrationTasksResp.items);
        return (
            <Summary summaries={migrationTaskSummaryItems} dataTestId="migration-job-overview-list"/>
        );
    };

    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, migrationResp.label, null);

    return (
        <>
            <PageHeading 
                subtitle="Series"
                title={migrationResp.label}
                breadcrumbs={breadcrumbs}
                linkURL="/migration" 
                linkText="Back to migration jobs list"
            />
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-8@m">
                    {renderTaskList()}
                </div>
            </div>
        </>
    );
}
