import PageHeading from "@/components/page-heading/PageHeading";
import MigrationForm from "@/components/form/migration/MigrationForm";
import { createMigrationJob } from "@/app/actions/createMigrationJob";

export default async function createPage() {
    return (
        <>
            <PageHeading 
                title="Create new migration job"
            />
            <MigrationForm 
                action={createMigrationJob}
            />
        </>
    );
}
