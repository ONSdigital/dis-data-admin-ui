export async function GET(req){
    const {searchParams} = new URL(req.url);
    const param = searchParams.get("q");

    // temporary logic until we work on env vars properly
    const apiRouterURL = process.env.API_ROUTER_URL;
    let fetchURL
    if (apiRouterURL) {
        fetchURL = apiRouterURL + "/datasets?limit=100";
    } else {
        fetchURL = "https://api.beta.ons.gov.uk/v1/datasets?limit=100"
    }

    const res = await fetch(fetchURL, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await res.json()

    const filtered = data.items.filter(item => {
        if (item.id.includes(param) || item.title.includes(param)) {
            return item
        }
    })

    return Response.json(filtered)
}