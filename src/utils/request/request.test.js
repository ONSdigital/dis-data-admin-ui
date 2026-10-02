jest.mock("uuid", () => ({
    v4: () => "test-request-id",
}));

jest.mock("../log/log", () => ({
    logInfo: jest.fn(),
    logWarn: jest.fn(),
    logError: jest.fn(),
}));

import {
    setHeaders,
    parseError,
    createResponse,
    request,
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
} from "./request";
import { logInfo, logWarn, logError } from "../log/log";

const createFetchResponse = ({
    ok = true,
    status = 200,
    statusText = "OK",
    json = null,
    text = "",
    etag = null,
    jsonError = null,
    textError = null,
} = {}) => {
    const headers = {
        get: jest.fn((key) => (key.toLowerCase() === "etag" ? etag : null)),
    };

    return {
        ok,
        status,
        statusText,
        headers,
        json: jest.fn(() => (jsonError ? Promise.reject(jsonError) : Promise.resolve(json))),
        text: jest.fn(() => (textError ? Promise.reject(textError) : Promise.resolve(text))),
    };
};

describe("setHeaders", () => {
    it("sets Florence and Authorization headers when an access token is provided", () => {
        const headers = setHeaders("token");

        expect(headers).toBeInstanceOf(Headers);
        expect(headers.get("X-Florence-Token")).toBe("token");
        expect(headers.get("Authorization")).toBe("token");
    });

    it("returns empty headers when no access token is provided", () => {
        const headers = setHeaders();

        expect(headers).toBeInstanceOf(Headers);
        expect(headers.get("X-Florence-Token")).toBeNull();
        expect(headers.get("Authorization")).toBeNull();
    });
});

describe("parseError", () => {
    it("parses the first API error from a JSON error body", () => {
        const errMsg = JSON.stringify({
            errors: [{ description: "Not found", code: "NotFound" }],
        });

        expect(parseError(errMsg, "Not Found")).toEqual({
            errorMessage: "Not found",
            code: "NotFound",
        });
    });

    it("falls back to the raw message when JSON has no errors array", () => {
        const errMsg = JSON.stringify({ message: "oops" });

        expect(parseError(errMsg, "Bad Request")).toEqual({
            errorMessage: errMsg,
            code: null,
        });
    });

    it("falls back to statusText when the body is not JSON", () => {
        expect(parseError("plain failure", "Internal Server Error")).toEqual({
            errorMessage: "plain failure",
            code: null,
        });
        expect(logWarn).toHaveBeenCalledWith(
            "failed to parse JSON response or didn't get JSON response. using fallback error.",
            null,
            null,
            expect.objectContaining({ message: expect.any(String) })
        );
    });

    it("falls back to statusText when the body is empty and not JSON", () => {
        expect(parseError("", "Bad Gateway")).toEqual({
            errorMessage: "Bad Gateway",
            code: null,
        });
    });

    it("falls back to a default message when body and statusText are unavailable", () => {
        expect(parseError(null, null)).toEqual({
            errorMessage: "Error message not available",
            code: null,
        });
    });
});

describe("createResponse", () => {
    it("returns a success response with no error", () => {
        expect(
            createResponse({
                res: { id: "1" },
                ok: true,
                status: 200,
                statusText: "OK",
                etag: "etag-1",
            })
        ).toEqual({
            error: null,
            ok: true,
            response: { id: "1" },
            status: 200,
            statusText: "OK",
            etag: "etag-1",
        });
    });

    it("parses an error when ok is false", () => {
        const errorMessage = JSON.stringify({
            errors: [{ description: "Forbidden", code: "Forbidden" }],
        });

        expect(
            createResponse({
                ok: false,
                status: 403,
                statusText: "Forbidden",
                errorMessage,
                etag: "etag-err",
            })
        ).toEqual({
            error: {
                errorMessage: "Forbidden",
                code: "Forbidden",
            },
            ok: false,
            response: null,
            status: 403,
            statusText: "Forbidden",
            etag: "etag-err",
        });
    });

    it("defaults optional fields when omitted", () => {
        expect(
            createResponse({
                ok: true,
                status: 204,
                statusText: "No Content",
            })
        ).toEqual({
            error: null,
            ok: true,
            response: null,
            status: 204,
            statusText: "No Content",
            etag: null,
        });
    });
});

describe("request", () => {
    const url = "http://api.test/resource";
    const accessToken = "token";

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("performs a successful GET and returns the parsed JSON body", async () => {
        const responseBody = { id: "1" };
        global.fetch.mockResolvedValueOnce(
            createFetchResponse({ json: responseBody, etag: "etag-1" })
        );

        const result = await request({ url, accessToken, method: "GET" });

        expect(global.fetch).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                method: "GET",
                body: undefined,
                signal: expect.any(AbortSignal),
            })
        );

        const fetchConfig = global.fetch.mock.calls[0][1];
        expect(fetchConfig.headers.get("X-Florence-Token")).toBe(accessToken);
        expect(fetchConfig.headers.get("Authorization")).toBe(accessToken);
        expect(fetchConfig.headers.get("Content-Type")).toBeNull();

        expect(result).toEqual({
            error: null,
            ok: true,
            response: responseBody,
            status: 200,
            statusText: "OK",
            etag: "etag-1",
        });
        expect(logInfo).toHaveBeenCalledWith(
            "http request started",
            null,
            expect.objectContaining({
                requestID: "test-request-id",
                method: "GET",
                path: url,
                statusCode: 0,
            })
        );
        expect(logInfo).toHaveBeenCalledWith(
            "http request completed",
            null,
            expect.objectContaining({
                requestID: "test-request-id",
                method: "GET",
                path: url,
                statusCode: 200,
            })
        );
    });

    it("omits auth headers when no access token is provided", async () => {
        global.fetch.mockResolvedValueOnce(createFetchResponse({ json: { ok: true } }));

        await request({ url, method: "GET" });

        const fetchConfig = global.fetch.mock.calls[0][1];
        expect(fetchConfig.headers.get("X-Florence-Token")).toBeNull();
        expect(fetchConfig.headers.get("Authorization")).toBeNull();
    });

    it("stringifies the body and sets Content-Type for POST requests", async () => {
        const body = { title: "Dataset" };
        global.fetch.mockResolvedValueOnce(
            createFetchResponse({ status: 201, statusText: "Created", json: body })
        );

        const result = await request({ url, accessToken, method: "POST", body });

        const fetchConfig = global.fetch.mock.calls[0][1];
        expect(fetchConfig.method).toBe("POST");
        expect(fetchConfig.body).toBe(JSON.stringify(body));
        expect(fetchConfig.headers.get("Content-Type")).toBe("application/json");
        expect(result.ok).toBe(true);
        expect(result.response).toEqual(body);
        expect(result.status).toBe(201);
    });

    it("stringifies the body and sets Content-Type for PUT requests", async () => {
        const body = { title: "Updated" };
        global.fetch.mockResolvedValueOnce(createFetchResponse({ json: body }));

        await request({ url, accessToken, method: "PUT", body });

        const fetchConfig = global.fetch.mock.calls[0][1];
        expect(fetchConfig.method).toBe("PUT");
        expect(fetchConfig.body).toBe(JSON.stringify(body));
        expect(fetchConfig.headers.get("Content-Type")).toBe("application/json");
    });

    it("stringifies an empty object when POST body is omitted", async () => {
        global.fetch.mockResolvedValueOnce(createFetchResponse({ json: {} }));

        await request({ url, accessToken, method: "POST" });

        const fetchConfig = global.fetch.mock.calls[0][1];
        expect(fetchConfig.body).toBe("{}");
    });

    it("returns a success response with null body for 204 responses", async () => {
        const fetchResponse = createFetchResponse({
            ok: true,
            status: 204,
            statusText: "",
            etag: "etag-204",
        });
        global.fetch.mockResolvedValueOnce(fetchResponse);

        const result = await request({ url, accessToken, method: "DELETE" });

        expect(result).toEqual({
            error: null,
            ok: true,
            response: null,
            status: 204,
            statusText: "Success",
            etag: "etag-204",
        });
        expect(fetchResponse.json).not.toHaveBeenCalled();
    });

    it("returns a parsed API error for non-ok JSON error responses", async () => {
        const errorBody = JSON.stringify({
            errors: [{ description: "Not found", code: "NotFound" }],
        });
        global.fetch.mockResolvedValueOnce(
            createFetchResponse({
                ok: false,
                status: 404,
                statusText: "Not Found",
                text: errorBody,
                etag: "etag-err",
            })
        );

        const result = await request({ url, accessToken, method: "GET" });

        expect(result).toEqual({
            error: {
                errorMessage: "Not found",
                code: "NotFound",
            },
            ok: false,
            response: null,
            status: 404,
            statusText: "Not Found",
            etag: "etag-err",
        });
        expect(logError).toHaveBeenCalledWith(
            "http request failed",
            { error: { message: errorBody } },
            expect.objectContaining({ statusCode: 404 })
        );
    });

    it("falls back to raw error text when error body is not JSON", async () => {
        global.fetch.mockResolvedValueOnce(
            createFetchResponse({
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
                text: "plain failure",
            })
        );

        const result = await request({ url, accessToken, method: "GET" });

        expect(result.error).toEqual({
            errorMessage: "plain failure",
            code: null,
        });
    });

    it("returns a failure response when reading the error body fails", async () => {
        const readError = new Error("body unread");
        global.fetch.mockResolvedValueOnce(
            createFetchResponse({
                ok: false,
                status: 502,
                statusText: "Bad Gateway",
                textError: readError,
                etag: "etag-unread",
            })
        );

        const result = await request({ url, accessToken, method: "GET" });

        expect(result).toEqual({
            error: {
                errorMessage: "Error message not available",
                code: null,
            },
            ok: false,
            response: null,
            status: 502,
            statusText: "Bad Gateway",
            etag: "etag-unread",
        });
        expect(logError).toHaveBeenCalledWith(
            "failed to read error response body",
            { error: readError },
            expect.objectContaining({ statusCode: 502 })
        );
    });

    it("returns a failure response when success body is not valid JSON", async () => {
        const jsonParseError = new Error("invalid json");
        global.fetch.mockResolvedValueOnce(
            createFetchResponse({
                ok: true,
                status: 200,
                statusText: "OK",
                jsonError: jsonParseError,
                etag: "etag-bad-json",
            })
        );

        const result = await request({ url, accessToken, method: "GET" });

        expect(result).toEqual({
            error: {
                errorMessage: "Response body was not valid JSON",
                code: null,
            },
            ok: false,
            response: null,
            status: 200,
            statusText: "OK",
            etag: "etag-bad-json",
        });
        expect(logError).toHaveBeenCalledWith(
            "failed to parse JSON response",
            { error: jsonParseError },
            expect.objectContaining({ statusCode: 200 })
        );
    });

    it("returns a failure response when fetch rejects with a network error", async () => {
        const networkError = new Error("network down");
        global.fetch.mockRejectedValueOnce(networkError);

        const result = await request({ url, accessToken, method: "GET" });

        expect(result).toEqual({
            error: {
                errorMessage: "network down",
                code: null,
            },
            ok: false,
            response: null,
            status: 0,
            statusText: "network down",
            etag: null,
        });
        expect(logError).toHaveBeenCalledWith(
            "http request failed",
            { error: networkError },
            expect.objectContaining({ statusCode: 0 })
        );
    });

    it("returns a timeout failure when fetch aborts", async () => {
        const abortError = new Error("aborted");
        abortError.name = "AbortError";
        global.fetch.mockRejectedValueOnce(abortError);

        const result = await request({ url, accessToken, method: "GET", timeoutMs: 2500 });

        expect(result).toEqual({
            error: {
                errorMessage: "Request timed out after 2500ms",
                code: null,
            },
            ok: false,
            response: null,
            status: 0,
            statusText: "Request timed out",
            etag: null,
        });
        expect(logError).toHaveBeenCalledWith(
            "http request timed out",
            { error: abortError },
            expect.objectContaining({ statusCode: 0 })
        );
    });

    it("returns a failure response when request body cannot be stringified", async () => {
        const circular = {};
        circular.self = circular;

        const result = await request({ url, accessToken, method: "POST", body: circular });

        expect(global.fetch).not.toHaveBeenCalled();
        expect(result).toEqual({
            error: {
                errorMessage: expect.any(String),
                code: null,
            },
            ok: false,
            response: null,
            status: 0,
            statusText: "Failed to stringify request body",
            etag: null,
        });
        expect(logError).toHaveBeenCalledWith(
            "failed to stringify request body",
            { error: expect.any(TypeError) },
            expect.objectContaining({ statusCode: 0 })
        );
    });
});

describe("http method helpers", () => {
    const url = "http://api.test/resource";
    const accessToken = "token";
    const body = { title: "Dataset" };

    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue(createFetchResponse({ json: {} }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("httpGet calls request with GET", async () => {
        await httpGet(url, accessToken);

        expect(global.fetch).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                method: "GET",
                body: undefined,
            })
        );
    });

    it("httpPost calls request with POST and body", async () => {
        await httpPost(url, accessToken, body);

        expect(global.fetch).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(body),
            })
        );
    });

    it("httpPut calls request with PUT and body", async () => {
        await httpPut(url, accessToken, body);

        expect(global.fetch).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                method: "PUT",
                body: JSON.stringify(body),
            })
        );
    });

    it("httpDelete calls request with DELETE", async () => {
        await httpDelete(url, accessToken);

        expect(global.fetch).toHaveBeenCalledWith(
            url,
            expect.objectContaining({
                method: "DELETE",
                body: undefined,
            })
        );
    });
});
