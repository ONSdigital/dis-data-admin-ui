import { cookies } from "next/headers";
import { httpGet, SSRequestConfig } from "@/utils/request/request";

import { updateDatasetSeries } from "@/app/actions/datasetSeries";

import PageHeading from "@/components/page-heading/PageHeading";
import { Panel } from "@/components/design-system/DesignSystem";
import SeriesForm from "@/components/form/series/SeriesForm";

export default async function createPage({params}) {
    const { id } = await params;

    const reqCfg = await SSRequestConfig(cookies);
    const topicsResp = await httpGet(reqCfg, "/topics");
    const datasetResp = await httpGet(reqCfg, `/datasets/${id}`);

    let datasetError, topicsError = false;
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (topicsResp.ok != null && !topicsResp.ok) {
        topicsError = true;
    }

    const renderErrorPanel = () => {
        if (datasetError) {
            return (
                <>
                    <Panel title="Error" variant="error">
                        <p>There was a problem retreiving data for this page. Please try again later.</p>
                    </Panel>
                </>
            );
        }

        if (topicsError) {
            return (
                <>
                    <Panel title="Topics service error" variant="error">
                        <p>There was a problem connecting to the topics API which is required for this form. Please try again later.</p>
                    </Panel>
                </>
            );
        }
        
    };

    const dataset = datasetResp?.next;
    const listOfAllTopics = topicsResp?.items;
    return (
        <>
            <PageHeading 
                title="Edit dataset series"
            /> 
            { !datasetError && !topicsError ? 
                <> 
                    <SeriesForm 
                        currentTitle={dataset.title} 
                        currentID={dataset.id} 
                        currentDescription={dataset.description} 
                        currentTopics={dataset.topics}
                        currentQMI={dataset.qmi?.href}
                        currentKeywords={dataset.keywords}
                        currentContacts={dataset.contacts}
                        listOfAllTopics={listOfAllTopics}
                        action={updateDatasetSeries}
                    />
                </>
                : renderErrorPanel()
            }
        </>
    );
}
