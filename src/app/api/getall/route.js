export async function GET(req){
    const { searchParams } = new URL(req.url);
    const datasetID = searchParams.get("datasetID");
    const editionID = searchParams.get("editionID");
    const versionID = searchParams.get("versionID");

    const datasetResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${datasetID}`)
    const dataset = await datasetResp.json()

    const editionResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${datasetID}/editions/${editionID}`)
    const edition = await editionResp.json()

    const versionResp = await fetch(`https://api.beta.ons.gov.uk/v1/datasets/${datasetID}/editions/${editionID}/versions/${versionID}`)
    const version = await versionResp.json()

    return Response.json({dataset, edition, version})
}