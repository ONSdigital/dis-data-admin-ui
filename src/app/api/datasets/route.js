export async function GET(req){
    const {searchParams} = new URL(req.url);
    const param = searchParams.get("q");

    const res = await fetch("https://api.beta.ons.gov.uk/v1/datasets?limit=100", {
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