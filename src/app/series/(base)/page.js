import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import Panel from "@/components/panel/Panel";
import List from "../../../components/list/List";
import { mapListItems } from "./mapper";

export default async function Series() {
    const reqCfg = await SSRequestConfig(cookies);
    const listItems = [];

    const data = await httpGet(reqCfg, "/datasets");
    let error = false;
    if (data.ok != null && !data.ok) {
        error = true;
    } else {
        listItems.push(...mapListItems(data.items));
    }

    return (
        <>
            { error ? <Panel title="Error" variant="error">
                    <p>
                        There was an issue retrieving the list of dataset series.
                    </p>
                </Panel> : ''}
            <div className="ons-u-mt-l ons-u-mb-l">
                <List items={listItems}/>
            </div>
        </>
    );
}
