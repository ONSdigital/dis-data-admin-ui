import { cookies } from 'next/headers'

import request from "@/utils/request/request"

import List from "../../components/list/List"
import { mapListItems } from './mapper';

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Datasets() {
    const baseURL = process.env.API_ROUTER_URL
    const cookieStore = await cookies()
    const authToken =  cookieStore.get("access_token")
    const reqCfg = {baseURL: baseURL, authToken: authToken.value}
    console.log(reqCfg)
    const data = await request(reqCfg, "/datasets")
    const listItems = mapListItems(data.items)
    
    return (
        <>
            <h1 className="ons-u-fs-xxxl">Find a dataset</h1>
            <Link href="datasets/create">Create</Link>
            <div className="ons-u-mt-l ons-u-mb-l">
                <List items={listItems}/>
            </div>
        </>
    );
}