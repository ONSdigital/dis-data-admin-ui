import LinkButton from "@/components/link-button/LinkButton";
import Table from "@/components/table/table";

import { migrationJobsList } from "../../../tests/mocks/migration-jobs.mjs";

export default function MigrationList() {
    let data, totalCount;
    const renderListArea = () => {
        return (
            <>
                <div className="ons-u-bb">
                    <div className="ons-grid ons-u-mb-m">
                        <div className="ons-grid__col ons-col-8@m ons-u-fs-m ons-u-mt-s">
                            Showing {data?.offset + 1} to {data?.offset + data?.count} of {totalCount} jobs
                        </div>
                        <div className="ons-grid__col ons-col-2@m ons-push-1@m">
                            <LinkButton
                                text="Create migration job"
                                link="series/create"
                            />
                        </div>
                    </div>
                </div>
                <Table />
            </>
        );
    };

    return (
        <>
            <div className="ons-grid ons-u-mt-l ons-u-mb-l">
                <div className="ons-grid__col ons-col-4@m ons-u-pr-s">
                    <p>Filters here</p>
                </div>
                <div className="ons-grid__col ons-col-8@m">
                    {renderListArea()}
                </div>
            </div>
        </>
    );
}
