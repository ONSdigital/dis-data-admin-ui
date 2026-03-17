import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import MigrationForm from "@/components/form/migration/MigrationForm";
import { createMigrationJob } from "@/app/actions/createMigrationJob";

export default async function createPage() {
    return (
        <>
            <PageHeading 
                title="Create new migration job"
            />
            <Panel dataTestId="mandatory-fields-panel" classes="ons-u-mb-l ons-u-dib">
                <p>You must fill in all fields unless marked optional</p>
            </Panel>
            <MigrationForm 
                action={createMigrationJob}
            />
        </>
    );
}
