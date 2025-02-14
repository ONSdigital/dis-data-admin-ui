import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import Hero from "@/components/hero/Hero";
import List from "@/components/list/List";
import { mapListItems } from './mapper';

export default async function Dataset({ params }) {
    const { id } = await params;
    const reqCfg = await SSRequestConfig(cookies);
    let dataset = await httpGet(reqCfg, `/datasets/${id}`);
    let editions = await httpGet(reqCfg, `/datasets/${id}/editions`);

    const listItems = mapListItems(editions.items, id);
    return (
        <>
            <Hero hyperLink={{ text: "Add new dataset edition", url: "/create" }} title={dataset.title} wide />           
            <div className="ons-grid ons-u-mt-xl">
                <div className="ons-grid__col ons-col-6@m">
                    <h2 className="ons-u-mt-m@xxs@m">Available editions</h2>
                    <List items={listItems}></List>
                </div>
                <div className="ons-grid__col ons-col-6@m ">
                    <h2 className="ons-u-mt-m@xxs@m">ID</h2>
                    <p>{dataset.id}</p>

                    <h2 className="ons-u-mt-m@xxs@m">Summary</h2>
                    <p>{dataset.description}</p>
                </div>
            </div>
        </>
    );
}