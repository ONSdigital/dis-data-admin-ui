import Link from "next/link";
import { cookies, headers } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { getAcessTokenFromCookie } from "@/utils/auth/auth";
import { getMigrationJob, getMigrationJobTasks } from "@/utils/request/api-clients/migration";
import { getDataset } from "@/utils/request/api-clients/datasets";
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
    const accessToken = await getAcessTokenFromCookie(cookies);
    const migrationResp = await getMigrationJob(id, accessToken);

    if (migrationResp.error) {
        return (
            <Panel title="Error" variant="error" dataTestId="migrations-job-overview-response-error">
                <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
            </Panel>
        );
    }

    const associatedDataset = migrationResp.response?.config?.target_id;

    const datasetResp = await getDataset(associatedDataset, accessToken);
    const dataset = datasetResp?.response?.next || datasetResp?.response?.current || datasetResp?.response;
    const canonicalTopic = dataset?.topics?.[0] || null;

    const displayMigrationJobDetails = migrationResp.response?.state !== "submitted" && migrationResp.response?.state !== "migrating";
    const isStateInReview = migrationResp.response?.state === "in_review";

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
                        <Link data-testid="migration-series-link" href={`/series/${datasetID}`} target="_blank">{migrationResp.response?.label}</Link>
                    </div>
                );
            }
        }
    };

    const renderTaskList = async () => {
        if (!displayMigrationJobDetails) {
            return (<p>Dataset series migration is still in progress. Try refreshing the page.</p>);
        }

        const migrationTasksResp = await getMigrationJobTasks(id, accessToken);
        if (migrationTasksResp.error) {
            return (
                <Panel title="Error" variant="error" dataTestId="migrations-job-overview-response-error">
                    <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
                </Panel>
            );
        }

        const migrationTaskTableItems = mapMigrationJobTable(migrationTasksResp.response?.items);

        return (
            <>
                {renderSeriesTask(migrationTasksResp.response?.items)}
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
                title={migrationResp.response?.label}
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
