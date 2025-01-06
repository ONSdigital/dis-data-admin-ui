import request from "@/utils/request/request"

import List from "../../components/list/List"
import { mapListItems } from './mapper';

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Datasets() {
    const data = await request(process.env.API_ROUTER_URL + "/datasets")
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