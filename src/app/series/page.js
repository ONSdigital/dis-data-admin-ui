import { cookies } from "next/headers";

import { httpGet, SSRequestConfig } from "@/utils/request/request";

import HeroPanel from "@/components/heroPanel/HeroPanel"
import Panel from "@/components/panel/Panel";
import List from "@/components/list/List";
import { mapListItems } from "./mapper";

import styles from './styles.module.css'

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
            <div className={styles.hero}>
                <HeroPanel hyperLink={{ text: 'Add New Dataset Series', url: 'series/create'}} title="Dataset Series" wide/>
            </div>

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