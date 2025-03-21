import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import Hero from "@/components/hero/Hero";
import List from "@/components/list/List";
import Panel from "@/components/panel/Panel";
import { mapListItems } from './mapper';

export default async function Dataset({ params }) {
    const { id } = await params;
    const reqCfg = await SSRequestConfig(cookies);
    let datasetResp = await httpGet(reqCfg, `/datasets/${id}`);
    let editions = await httpGet(reqCfg, `/datasets/${id}/editions`);

    let datasetError, editionsError = false;
    const listItems = [];
    if (datasetResp.ok != null && !datasetResp.ok) {
        datasetError = true;
    }

    if (editions.ok != null && !editions.ok) {
        editionsError = true;
    } else {
        listItems.push(...mapListItems(editions.items, id));
    }

    const renderEditionsList = () => {
        return (
            <>
            { !editionsError ? 
                <>
                    <h2 className="ons-u-mt-m@xxs@m">Available editions</h2>
                    <List items={listItems} noResultsText="No editions found for dataset"></List>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the list of editions for this dataset. Try refreshing the page.</p></Panel> }
            </>
        );
    };

    const createURL = `${id}/editions/create`;
    const dataset = datasetResp?.current || datasetResp?.next || datasetResp;
    return (
        <>
            { !datasetError ? 
                <>
                    <Hero hyperLink={{ text: "Add new dataset edition", url: createURL }} title={dataset.title} wide />           
                    <div className="ons-grid ons-u-mt-xl">
                        <div className="ons-grid__col ons-col-6@m">
                            { renderEditionsList() }
                        </div>
                        <div className="ons-grid__col ons-col-6@m ">
                            <h2 className="ons-u-mt-m@xxs@m">ID</h2>
                            <p data-testid="id-field">{dataset.id}</p>

                            <h2 className="ons-u-mt-m@xxs@m">Summary</h2>
                            <p data-testid="description-field">{dataset.description}</p>
                        </div>
                    </div>
                </>
            : <Panel title="Error" variant="error"><p>There was an issue retrieving the data for this page. Try refreshing the page.</p></Panel> }
        </>
    );
}
