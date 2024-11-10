import request from "@/utils/request/request";

import List from "../../../components/list/List"
import { mapListItems } from './mapper';

export default async function Dataset({ params }) {
    const { id } = await params
    let dataset = await request(`https://api.beta.ons.gov.uk/v1/datasets/${id}`)
    let editions = await request(`https://api.beta.ons.gov.uk/v1/datasets/${id}/editions`)

    const listItems = mapListItems(editions.items, id)
    return (
        <>
            <div className="ons-u-fs-m ons-u-mt-s ons-u-pb-xxs" style={{"color":"#707071"}}>Dataset</div>
            <h1 className="ons-u-fs-xxxl">{dataset.title}</h1>
            <p>Select an edition to view or edit.</p>
            <List items={listItems}></List>
        </>
    );
}