import { cookies } from "next/headers";

import request from "@/utils/request/request";

import List from "../../components/list/List";
import { mapListItems } from "./mapper";

export default async function Datasets() {
    const baseURL = process.env.API_ROUTER_URL;
    const cookieStore = await cookies();
    const authToken =  cookieStore.get("access_token");
    const reqCfg = {baseURL: baseURL, authToken: authToken.value};

    const listItems = [{
        id: "Create New Dataset",
        title: "Create",
        url: "/datasets/create"
    }]

    const data = await request(reqCfg, "/datasets");
    listItems.push(...mapListItems(data.items));

    return (
        <>
            <h1 className="ons-u-fs-xxxl">Find a dataset</h1>
            <div className="ons-u-mt-l ons-u-mb-l">
                <List items={listItems}/>
            </div>
        </>
    );
}
