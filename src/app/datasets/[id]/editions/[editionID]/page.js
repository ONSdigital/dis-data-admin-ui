import List from "../../../../../components/list/List"
import { mapListItems } from "./mapper"


export default async function Dataset({ params }) {
    const { id, editionID } = await params
    let datasetsResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${id}`)
    let editionResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${id}/editions/${editionID}`)
    let versionsResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${id}/editions/${editionID}/versions`)
    let dataset = await datasetsResp.json()
    let edition = await editionResp.json()
    let versions = await versionsResp.json()

    const listItems = mapListItems(versions.items, id, editionID)
    return (
        <>
            <div className="ons-u-fs-m ons-u-mt-s ons-u-pb-xxs" style={{"color":"#707071"}}>Edition </div>
            <h1 className="ons-u-fs-xxxl">{dataset.title}: {edition.edition}</h1>
            <p>Select a version to view or edit.</p>
            <List items={listItems} />
        </>
    );
}