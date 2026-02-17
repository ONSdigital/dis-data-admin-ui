import { cookies, headers } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";
import { generateBreadcrumb } from "@/utils/breadcrumb/breadcrumb";

import { BoxContainer, Panel } from "@/components/design-system/DesignSystem";
import PageHeading from "@/components/page-heading/PageHeading";
import LinkButton from "@/components/link-button/LinkButton";
import Table from "@/components/table/Table";

import { mapMigrationListTable } from "@/components/table/mapper";

const FAKE_LABEL = "Migration test"

export default async function MigrationOverview({ params }) {
    const { id } = await params;
    const reqCfg = await SSRequestConfig(cookies, "migration-service");

    const migrationResp = await httpGet(reqCfg, `/migration-jobs/${id}`);
    // if (migrationResp.ok != null && !migrationResp.ok) {
    //     return (
    //         <Panel title="Error" variant="error" dataTestId="migrations-list-response-error">
    //             <p>There was an issue retrieving the data for this page. Try refreshing the page.</p>
    //         </Panel>
    //     );
    // }

    const currentURLPath = (await headers()).get("x-request-pathname") || "";
    const breadcrumbs = generateBreadcrumb(currentURLPath, FAKE_LABEL, null);

    return (
        <>
            <PageHeading 
                subtitle="Series"
                title={FAKE_LABEL}
                breadcrumbs={breadcrumbs}
                linkURL="/migration" 
                linkText="Back to migration jobs list"
            />
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-8@m">
                    <p>TABLE HERE</p>
                </div>
            </div>
        </>
    );
}
