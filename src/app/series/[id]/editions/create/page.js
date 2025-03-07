import { httpGet, SSRequestConfig } from "@/utils/request/request";

import CreateEditionForm from "./CreateEdition";


export default async function CreateEditionPage({ params }) {
    const { id } = await params;

    return (
        <>
            <CreateEditionForm datasetID={id} />
        </>
    );
}
