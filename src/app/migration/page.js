import { BoxContainer } from "@/components/design-system/DesignSystem";
import LinkButton from "@/components/link-button/LinkButton";
import Table from "@/components/table/Table";

import { migrationJobsList } from "../../../tests/mocks/migration-jobs.mjs";
import { mapMigrationListTable } from "@/components/table/mapper";

export default function MigrationList() {
    const mappedTable = mapMigrationListTable(migrationJobsList.items);
    const renderListArea = () => {
        return (
            <>
                <div className="ons-u-bb">
                    <div className="ons-grid ons-u-mb-m">
                        <div className="ons-grid__col ons-col-8@m ons-u-fs-m ons-u-mt-s">
                            Showing 1 to 5 of 5 jobs
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

    return (
        <>
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-4@m ons-u-pr-m">
                    <BoxContainer
                        borderColor="ons-color-grey-15"
                        borderWidth={1}
                        classes="ons-grid__col ons-u-pl-no"
                        id="box-container"
                        title="Search and filter"
                    >
                        <p className="ons-u-mt-m">Search and filters coming soon</p>
                    </BoxContainer>
                </div>
                <div className="ons-grid__col ons-col-8@m">
                    {renderListArea()}
                </div>
            </div>
        </>
    );
}
