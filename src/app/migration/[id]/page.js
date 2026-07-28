import Link from "next/link";
import { cookies, headers } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";
import LinkButton from "@/components/link-button/LinkButton";
import StateChangeButton from "@/components/state-change-button/StateChangeButton";
import SuccessPanel from "@/components/success-panel/SuccessPanel";

import { mapMigrationJobTable } from "@/components/table/mapper";
import Table from "@/components/table/Table";

import { updateMigrationJobState } from "@/app/actions/migrationJob";

export default async function MigrationOverview({ params, searchParams }) {
    const { id } = await params;
    const query = await searchParams;
    const msReqCfg = await SSRequestConfig(cookies, "migration-service");

    const migrationResp = await httpGet(msReqCfg, `/migration-jobs/${id}`);
    if (migrationResp.ok != null && !migrationResp.ok) {
        return (
            <Panel title="Error" variant="error" dataTestId="migrations-job-overview-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const associatedDataset = migrationResp.config?.target_id;

    const dsReqCfg = await SSRequestConfig(cookies, "api-router");
    const datasetResp = await httpGet(dsReqCfg, `/datasets/${associatedDataset}`);
    const dataset = datasetResp?.next || datasetResp?.current || datasetResp;
    const canonicalTopic = dataset?.topics?.[0] || null;

    const displayMigrationJobDetails = migrationResp.state !== "submitted" && migrationResp.state !== "migrating";
    const isStateInReview = migrationResp.state === "in_review";

    const renderPreviewPanel = () => {
        return (
            <Panel dataTestId="migration-job-preview-panel" classes="ons-u-mb-l">
                <p><b>Preview</b><br/>
                <a href={`/${canonicalTopic}/datasets/${associatedDataset}`} target="_blank">View this series</a> as it will appear on the ONS website</p>
            </Panel>
        );
    };

    const renderButtons = () => {
        return (
            <>
                <StateChangeButton
                    classes="ons-u-ml-xs ons-u-mt-m ons-u-pt-m"
                    dataTestId="migration-approve-button"
                    id="migration-approve-button"
                    text="Approve"
                    jobID={id}
                    jobState={"approved"}
                    series={associatedDataset}
                    onClick={updateMigrationJobState}
                />
                <LinkButton
                    dataTestId="migration-reject-button"
                    text="Reject"
                    link={`/migration/${id}/reject/${associatedDataset}`}
                    variants={["secondary"]}
                    classes="ons-u-ml-xs ons-u-mt-m ons-u-pt-m"
                />
            </>
        );
    };

    const renderSeriesTask = (taskList) => {
        if (!Array.isArray(taskList) || taskList.length > 0) {
            // we use the first item as all items contain the dataset ID
            const datasetID = taskList[0]?.target?.dataset_id;
            if (datasetID) {
                return (
                    <div className="ons-u-mb-m">
                        <p className="ons-u-mb-no ons-u-fw-b">Series</p>
                        <Link data-testid="migration-series-link" href={`/series/${datasetID}`} target="_blank">{migrationResp.label}</Link>
                    </div>
                );
            }
        }
    };

    const renderTaskList = async () => {
        if (!displayMigrationJobDetails) {
            return (<p>Dataset series migration is still in progress. Try refreshing the page.</p>);
        }

        const migrationTasksResp = await httpGet(msReqCfg, `/migration-jobs/${id}/tasks`);
        if (migrationTasksResp.ok != null && !migrationTasksResp.ok) {
            return (
                <Panel title="Error" variant="error" dataTestId="migrations-job-overview-response-error">
                    <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
                </Panel>
            );
        }

        const migrationTaskTableItems = mapMigrationJobTable(migrationTasksResp.items);

        return (
            <>
                {renderSeriesTask(migrationTasksResp.items)}
                <Table contents={migrationTaskTableItems} dataTestId={"migration-overview-task-table"} />
            </>
        );
    };

    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, migrationResp.label, null);

    return (
        <>
            <SuccessPanel query={query} contentType={query.jobNumber}/>
            <PageHeading
                subtitle="Series"
                title={migrationResp.label}
                breadcrumbs={breadcrumbs}
                linkURL="/migration"
                linkText="Back to migration jobs list"
            />
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-8@m">
                    {displayMigrationJobDetails && canonicalTopic && renderPreviewPanel()}
                    {renderTaskList()}
                    {isStateInReview && renderButtons()}
                </div>
            </div>
        </>
    );
}
