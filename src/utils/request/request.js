import { logInfo, logError } from '../log/log';

// work in progress/place holder request func
export default async function request(url) {
    const startedAt = new Date(Date.now()).toISOString();
    logInfo("http request started", null, {requestID: "", method: "GET", path: url, statusCode: 0, startedAt: startedAt, endedAt: null})

    const response = await fetch(url);
    
    if (response.status >= 400 ) {
        logError("http request failed", null, null, {requestID: "", method: "GET", path: url, statusCode: 0, startedAt, endedAt: null})
    }
    const json = await response.json();

    const endedAt = new Date(Date.now()).toISOString();
    logInfo("http request completed", null, {requestID: "", method: "GET", path: url, statusCode: response.status, startedAt, endedAt: endedAt})
    return json;
}