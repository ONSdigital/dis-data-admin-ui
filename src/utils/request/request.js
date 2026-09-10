import { v4 as uuidv4 } from "uuid";
import { logInfo, logError } from "../log/log";

const xFlorenceHeaderKey = "X-Florence-Token";
const authHeaderKey = "Authorization";
const defaultTimeoutMs = 10000;

/**
 * @param {string} authToken - user auth token obtained from access_token cookie
 * @return {array} headers array or empty array
 */
const setHeaders = (authToken) => {
    const headers = new Headers();
    if (authToken) {
        headers.set(xFlorenceHeaderKey, authToken);
        headers.set(authHeaderKey, authToken);
    }
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
 * @param {{res?: object|string|null, ok: boolean, status: number, statusText: string, errorMessage?: string|null, etag?: string|null}} [options]
 * @return {object} - standardised request object
 */
const createResponse = ({ res = null, ok, status, statusText, errorMessage = null, etag = null } = {}) => {
    return {
        error: !ok ? parseError(errorMessage, statusText) : null,
        ok,
        response: res,
        status,
        statusText,
        etag
    };
};

/**
 * Creates a logger scoped to a single HTTP request.
 * @param {{ requestID: string, method: string, path: string, startedAt: string }} ctx
 * @return {{ start: function, success: function, failure: function }}
 */
const createHttpLogger = ({ requestID, method, path, startedAt }) => {
    const buildHttp = (statusCode, finished) => ({
        requestID,
        method,
        path,
        statusCode,
        startedAt,
        endedAt: finished ? new Date().toISOString() : null,
    });

    return {
        start() {
            logInfo("http request started", null, buildHttp(0, false));
        },

        success(statusCode) {
            logInfo("http request completed", null, buildHttp(statusCode, true));
        },

        failure(statusCode, error = null, event = "http request failed") {
            logError(event, error ? { error } : null, buildHttp(statusCode, true));
        },
    };
};

/**
 * Performs an HTTP request and returns a standardised result.
 * @param {{ url: string, accessToken?: string, method: string, body?: object, timeoutMs?: number }} options
 * @return {Promise<object>} - standardised request object from createResponse
 */
const request = async ({ url, accessToken, method, body, timeoutMs = defaultTimeoutMs, }) => {
    const requestID = uuidv4();
    const startedAt = new Date().toISOString();
    const httpLog = createHttpLogger({ requestID, method, path: url, startedAt });

    httpLog.start();

    const headers = setHeaders(accessToken);
    const controller = new AbortController();

    let serializedBody;
    if (method === "POST" || method === "PUT") {
        try {
            serializedBody = JSON.stringify(body || {});
            headers.set("Content-Type", "application/json");
        } catch (error) {
            httpLog.failure(0, error, "failed to stringify request body");
            return createResponse({
                ok: false,
                status: 0,
                statusText: "Failed to stringify request body",
                errorMessage: error.message,
            });
        }
    }

    const timeout = setTimeout(() => { controller.abort(); }, timeoutMs);
    const fetchConfig = {
        method,
        headers,
        signal: controller.signal,
        body: serializedBody,
    };

    let response, etag;
    try {
        response = await fetch(url, fetchConfig);
        etag = response.headers.get("etag");
    } catch (error) {
        if (error.name === "AbortError") {
            const message = `Request timed out after ${timeoutMs}ms`;
            httpLog.failure(0, error, "http request timed out");
            return createResponse({
                ok: false,
                status: 0,
                statusText: "Request timed out",
                errorMessage: message,
            });
        }
        httpLog.failure(0, error);
        return createResponse({
            ok: false,
            status: 0,
            statusText: error.message,
            errorMessage: error.message,
        });
    } finally {
        clearTimeout(timeout);
    }

    if (!response.ok) {
        let errorMessage = null;
        try {
            errorMessage = await response.text();
        } catch (error) {
            httpLog.failure(response.status, error, "failed to read error response body");
            return createResponse({
                ok: false,
                status: response.status,
                statusText: response.statusText,
                etag,
            });
        }
        httpLog.failure(response.status, { message: errorMessage });
        return createResponse({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            errorMessage,
            etag,
        });
    }

    if (response.status === 204) {
        httpLog.success(response.status);
        return createResponse({
            ok: response.ok,
            status: response.status,
            statusText: response.statusText || "Success",
            etag,
        });
    }

    let json;
    try {
        json = await response.json();
    } catch (error) {
        httpLog.failure(response.status, error, "failed to parse JSON response");
        return createResponse({
            ok: false,
            status: response.status,
            statusText: response.statusText,
            errorMessage: "Response body was not valid JSON",
            etag,
        });
    }

    httpLog.success(response.status);
    return createResponse({
        res: json,
        ok: response.ok,
        status: response.status,
        statusText: response.statusText || "Success",
        etag,
    });
};

/**
 * Performs an authenticated HTTP GET request.
 * @param {string} url - request URL
 * @param {string} accessToken - user auth token obtained from access_token cookie
 * @return {Promise<object>} - standardised request object from createResponse
 */
const httpGet = (url, accessToken) => {
    return request({ url, accessToken, method: "GET" });
};

/**
 * Performs an authenticated HTTP POST request.
 * @param {string} url - request URL
 * @param {string} accessToken - user auth token obtained from access_token cookie
 * @param {object} [body] - JSON-serialisable request body
 * @return {Promise<object>} - standardised request object from createResponse
 */
const httpPost = (url, accessToken, body) => {
    return request({ url, accessToken, method: "POST", body });
};

/**
 * Performs an authenticated HTTP PUT request.
 * @param {string} url - request URL
 * @param {string} accessToken - user auth token obtained from access_token cookie
 * @param {object} [body] - JSON-serialisable request body
 * @return {Promise<object>} - standardised request object from createResponse
 */
const httpPut = (url, accessToken, body) => {
    return request({ url, accessToken, method: "PUT", body });
};

/**
 * Performs an authenticated HTTP DELETE request.
 * @param {string} url - request URL
 * @param {string} accessToken - user auth token obtained from access_token cookie
 * @return {Promise<object>} - standardised request object from createResponse
 */
const httpDelete = (url, accessToken) => {
    return request({ url, accessToken, method: "DELETE" });
};

export { httpGet, httpPost, httpPut, httpDelete };
