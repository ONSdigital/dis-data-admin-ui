import List from "../../../components/list/List"
import { mapListItems } from './mapper';

export default async function Dataset({ params }) {
    const { id } = await params
    let datasetsResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${id}`)
    let editionsResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${id}/editions`)
    let dataset = await datasetsResp.json()
    let editions = await editionsResp.json()

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