import { v4 as uuidv4 } from "uuid";
import { logInfo, logError } from "../log/log";

const xFlorenceHeaderKey = "X-Florence-Token";
const authHeaderKey = "Authorization";
const bearerPrefix = "Bearer ";

/**
 * @param {string} authToken - user auth token obtained from access_token cookie
 * @return {array} headers array or empty array
 */
const setHeaders = (authToken) => {
    if (!authToken) {
        return [];
    }
    const headers = new Headers();
    headers.set(xFlorenceHeaderKey, authToken);
    headers.set(authHeaderKey, authToken);
    return headers;
};

/**
 * Parses an error response body into a structured error object.
 * @param {string} errMsg - raw error response body (JSON string or plain text)
 * @param {string} [statusText] - HTTP status text used as a fallback when the body is unavailable
 * @return {object} - standardised request error object
 */
const parseError = (errMsg, statusText) => {
    try {
        const err = JSON.parse(errMsg)?.errors?.[0];
        return { 
            errorMessage: err?.description || errMsg || "Error message not available",
            code: err?.code || null};
    } catch (e) {
        return { 
            errorMessage: errMsg || statusText || "Error message not available", 
            code: null 
        };
    }
};

/**
 * Builds a standardised request result.
 * @param {object|string|null} res - parsed response body on success, otherwise null
 * @param {boolean} ok - whether the request succeeded
 * @param {number} status - HTTP status code (0 when unavailable, e.g. network failure)
 * @param {string} statusText - HTTP status text or a synthetic failure label
 * @param {string|null} errorMessage - raw error body to parse when ok is false
 * @param {string|null} [etag] - ETag header value when present
 * @return {object} - standardised request object
 */
const createResponse = (res, ok, status, statusText, errorMessage, etag = null) => {
    return {
        error: !ok ? parseError(errorMessage, statusText) : null,
        ok: ok,
        response: res,
        status: status,
        statusText: statusText,
        etag
    };
};

/**
 * Logs an HTTP request lifecycle event for the request helper.
 * @param {boolean} ok - whether to log as success (info) or failure (error)
 * @param {object} options - http log options
 * @return {void}
 */
const log = (ok, { requestID, method, path, statusCode, startedAt, event, finished = true, error = null }) => {
    const endedAt = finished ? new Date().toISOString() : null;
    const http = { requestID, method, path, statusCode, startedAt, endedAt };
    const resolvedEvent = event ?? (
        !finished ? "http request started" : ok ? "http request completed" : "http request failed"
    );

    if (!finished || ok) {
        logInfo(resolvedEvent, null, http);
        return;
    }

    logError(resolvedEvent, error ? { error } : null, http);
};

// work in progress/place holder request func
const request = async (url, accessToken, method, body) => {
    const requestID = uuidv4();
    const startedAt = new Date().toISOString();
    log(true, { requestID, method, path: url, statusCode: 0, startedAt, finished: false });

    const headers = setHeaders(accessToken);
    const fetchConfig = {
        method,
        headers
    };

    if (method === "POST" || method === "PUT") {
        fetchConfig.body = JSON.stringify(body || {});
        fetchConfig.headers.append("Content-Type", "application/json");
    }

    let response, etag;
    try {
        response = await fetch(url, fetchConfig);
        etag = response.headers.get("etag");
    } catch (error) {
        log(false, { requestID, method, path: url, statusCode: 0, startedAt, error });
        return createResponse(null, false, 0, error.message, error.message, null);
    }

    if (response.status >= 400) {
        const errorMessage = await response.text();
        log(false, {
            requestID,
            method,
            path: url,
            statusCode: response.status,
            startedAt,
            error: { message: errorMessage }
        });
        return createResponse(null, response.ok, response.status, response.statusText, errorMessage, etag);
    }

    if (response.status === 204) {
        log(true, { requestID, method, path: url, statusCode: response.status, startedAt });
        return createResponse(null, response.ok, response.status, response.statusText, null, etag);
    }

    let json;
    try {
        json = await response.json();
    } catch (error) {
        log(false, {
            requestID,
            method,
            path: url,
            statusCode: response.status,
            startedAt,
            event: "failed to parse JSON response",
            error
        });
        return createResponse(null, false, response.status, response.statusText, "Response body was not valid JSON", etag);
    }

    log(true, { requestID, method, path: url, statusCode: response.status, startedAt });
    return createResponse(json, response.ok, response.status, "Success", null, etag);
};

/**
 * @param {function} cookies - NextJS cookies getter function
 * @param {string} service - service to make the request to
 * @return {object} response config object contain base url and authorisation values
 */
const SSRequestConfig = async (cookies, service = "api-router") => {
    let baseURL;
    switch (service) {
        case "api-router":
            baseURL = process.env.API_ROUTER_URL;
            break;
        case "migration-service":
            baseURL = process.env.MIGRATION_SERVICE_URL;
            break;
        default:
            baseURL = process.env.API_ROUTER_URL;
    }
    const cookieStore = await cookies();
    const authToken = cookieStore.get("access_token");
    const cleanAuthToken = authToken.value.replace(/"/g, "");
    return { baseURL: baseURL, authToken: cleanAuthToken };
};

/**
 * @param {object} appConfig - appConfig object, see: utils/config
 * @return {object} response config object contain base url and authorisation values
 */
const CSRequestConfig = (appConfig) => {
    const cookies = document.cookie.split(";");
    let authToken;
    cookies.forEach(cookie => {
        const c = cookie.split("=");
        if (c[0] == "id_token") { authToken = bearerPrefix + c[1]; }
    });
    return { baseURL: appConfig.apiRouterURL, authToken: authToken };
};

/**
 * @param {object} cfg - request config object generated by SSRequestConfig function
 * @param {string} url - relative path to api router
 * @return {Promise} fetch response body in JSON format
 */
const httpGet = (url, accessToken) => {
    return request(url, accessToken, "GET");
};

/**
 * @param {object} cfg - request config object generated by SSRequestConfig function
 * @param {string} url - relative path to api router
 * @param {object} body - body contents of request
 * @return {Promise} fetch response body in JSON format
 */
const httpPost = (url, accessToken, body) => {
    return request(url, accessToken, "POST", body);
};

/**
 * @param {object} cfg - request config object generated by SSRequestConfig function
 * @param {string} url - relative path to api router
 * @param {object} body - body contents of request
 * @return {Promise} fetch response body in JSON format
 */
const httpPut = (url, accessToken, body) => {
    return request(url, accessToken, "PUT", body);
};

/**
 * @param {object} cfg - request config object generated by SSRequestConfig function
 * @param {string} url - relative path to api router
 * @return {Promise} fetch response body in JSON format
 */
const httpDelete = (url, accessToken) => {
    return request(url, accessToken, "DELETE");
};

export { httpGet, httpPost, httpPut, httpDelete, SSRequestConfig, CSRequestConfig };
