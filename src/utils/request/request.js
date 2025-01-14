import { logInfo, logError } from "../log/log";

const xFlorenceHeaderKey = "X-Florence-Token";
const authHeaderKey = "Authorization";

// work in progress/place holder request func
const request = async (cfg, url) => {
    const startedAt = new Date(Date.now()).toISOString();
    logInfo("http request started", null, {requestID: "", method: "GET", path: url, statusCode: 0, startedAt: startedAt, endedAt: null});

    const headers = setHeaders(cfg.authToken);
    const response = await fetch(cfg.baseURL + url, { headers: headers });
    
    if (response.status >= 400 ) {
        logError("http request failed", null, null, {requestID: "", method: "GET", path: url, statusCode: 0, startedAt, endedAt: null});
    }
    const json = await response.json();

    const endedAt = new Date(Date.now()).toISOString();
    logInfo("http request completed", null, {requestID: "", method: "GET", path: url, statusCode: response.status, startedAt, endedAt: endedAt});
    return json;
}

const setHeaders = (authToken) => {
    const headers = new Headers();
    headers.set(xFlorenceHeaderKey, authToken);
    headers.set(authHeaderKey, authToken);
    return headers;
}

const SSRequestConfig = async (cookies) => {
    const baseURL = process.env.API_ROUTER_URL;
    const cookieStore = await cookies();
    const authToken =  cookieStore.get("access_token");
    return {baseURL: baseURL, authToken: authToken.value};
}

export { request, SSRequestConfig }
