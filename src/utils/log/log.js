// {
//     "created_at": "2024-10-30T17:02:42.702955Z",
//     "data": {
//       "action": "retrieving service health",
//       "method": "GET",
//       "uri": "https://api.dp.aws.onsdigital.uk/v1"
//     },
//     "event": "Making request to service: api-router",
//     "namespace": "dp-frontend-search-controller",
//     "severity": 3
// }


const createLog = (event) => {
    const log = {
        "created_at": new Date().toISOString(),
        "data": {
            // "action": "retrieving service health",
            // "method": "GET",
            // "uri": "https://api.dp.aws.onsdigital.uk/v1"
        },
        "event": event,
        "namespace": "dis-data-admin-ui-next",
    }
    console.log(log)
}

export const logEvent = (event) => {
    createLog(event)
}
