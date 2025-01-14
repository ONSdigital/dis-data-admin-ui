import { logInfo, logError } from "../log/log";

const xFlorenceHeaderKey = "X-Florence-Token";
const authHeaderKey = "Authorization";

const setHeaders = (authToken) => {
    if (!authToken) {
        return [];
    }
    const headers = new Headers();
    headers.set(xFlorenceHeaderKey, authToken);
    headers.set(authHeaderKey, authToken);
    return headers;
}

// work in progress/place holder request func
const request = async (cfg, url, method, body) => {
    const startedAt = new Date(Date.now()).toISOString();
    logInfo("http request started", null, {requestID: "", method: method, path: url, statusCode: 0, startedAt: startedAt, endedAt: null});

    const headers = setHeaders(cfg.authToken);
    const fetchConfig = {
        method,
        headers
    }

    if (method === "POST" || method === "PUT") {
        fetchConfig.body = JSON.stringify(body || {});
    }

    const response = await fetch(cfg.baseURL + url, fetchConfig);
    
    if (response.status >= 400 ) {
        logError("http request failed", null, null, {requestID: "", method: method, path: url, statusCode: 0, startedAt, endedAt: null});
    }
    const json = await response.json();

    const endedAt = new Date(Date.now()).toISOString();
    logInfo("http request completed", null, {requestID: "", method: method, path: url, statusCode: response.status, startedAt, endedAt: endedAt});
    return json;
}

const SSRequestConfig = async (cookies) => {
    const baseURL = process.env.API_ROUTER_URL;
    const cookieStore = await cookies();
    const authToken =  cookieStore.get("access_token");
    return { baseURL: baseURL, authToken: authToken.value };
}

const httpGet = (cfg, url) => {
    return request(cfg, url, "GET")
}

const httpPost = (cfg, url, body) => {
    return request(cfg, url, "POST", body)
}

const httpPut = (cfg, url, body) => {
    return request(cfg, url, "PUT", body)
}

const httpDelete = (cfg, url) => {
    return request(cfg, url, "DELETE")
}

export { httpGet, httpPost, httpPut, httpDelete, SSRequestConfig }
