import getAppConfig, { getAPIRouterURL, getUploadBaseURL } from "./config";

const setupMockEnv = () => {
    return {
        API_ROUTER_URL: "test.com/api",
        ENV_NAME: "",
        TEST_VALUE: "testing"
    }
};

let mockEnv = setupMockEnv();

afterEach(() => {
    mockEnv = setupMockEnv();
});

describe("getAPIRouter", () => {
    it("returns null if no 'API_ROUTER_URL' value", () => {
        mockEnv.API_ROUTER_URL = "";
        expect(getAPIRouterURL(mockEnv)).toBe(null);
    });

    it("returns value if 'API_ROUTER_URL' is set", () => {;
        expect(getAPIRouterURL(mockEnv)).toBe(mockEnv.API_ROUTER_URL);
    });
});

describe("getUploadBaseURL", () => {
    it("returns 'API_ROUTER_URL' value if 'ENV_NAME' is empty", () => {
        expect(getUploadBaseURL(mockEnv)).toBe(mockEnv.API_ROUTER_URL);
    });

    it("return an API proxy url string if 'ENV_NAME' is set to 'sandbox'", () => {
        mockEnv.ENV_NAME = "sandbox";
        expect(getUploadBaseURL(mockEnv)).toBe("/api/v1");
    });

    it("return an API proxy url string if 'ENV_NAME' is set to 'staging'", () => {
        mockEnv.ENV_NAME = "staging";
        expect(getUploadBaseURL(mockEnv)).toBe("/api/v1");
    });

    it("return an API proxy url string if 'ENV_NAME' is set to 'prod'", () => {
        mockEnv.ENV_NAME = "prod";
        expect(getUploadBaseURL(mockEnv)).toBe("/api/v1");
    });
});

test("getAppConfig returns expected object", () => {
    const config = getAppConfig(mockEnv);
    expect(config.apiRouterURL).toBe("test.com/api");
    expect(config.uploadBaseURL).toBe("test.com/api");
});
