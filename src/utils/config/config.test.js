import getAppConfig from "./config";

const setupMockEnv = () => {
    return {
        API_ROUTER_URL: "test.com/api",
        API_ROUTER_URL_FOR_CLIENT: "test.com/api/client",
        ENV_NAME: "dev",
        MIGRATION_SERVICE_URL: "test.com/migration/",
    };
};

let mockEnv = setupMockEnv();

afterEach(() => {
    mockEnv = setupMockEnv();
});

describe("getAppConfig", () => {
    it("returns expected object when all env vars are set", () => {
        const config = getAppConfig(mockEnv);

        expect(config.apiRouterURL).toBe("test.com/api");
        expect(config.apiRouterURLForClient).toBe("test.com/api/client");
        expect(config.envName).toBe("dev");
        expect(config.migrationServiceURL).toBe("test.com/migration/");
    });

    it("falls back to default 'API_ROUTER_URL' when not set", () => {
        mockEnv.API_ROUTER_URL = "";
        const config = getAppConfig(mockEnv);

        expect(config.apiRouterURL).toBe("http://localhost:23200/v1");
    });

    it("falls back to default 'API_ROUTER_URL_FOR_CLIENT' when not set", () => {
        mockEnv.API_ROUTER_URL_FOR_CLIENT = "";
        const config = getAppConfig(mockEnv);

        expect(config.apiRouterURLForClient).toBe("http://localhost:23200/v1");
    });

    it("falls back to default 'ENV_NAME' when not set", () => {
        mockEnv.ENV_NAME = "";
        const config = getAppConfig(mockEnv);

        expect(config.envName).toBe("dev");
    });

    it("falls back to default 'MIGRATION_SERVICE_URL' when not set", () => {
        mockEnv.MIGRATION_SERVICE_URL = "";
        const config = getAppConfig(mockEnv);

        expect(config.migrationServiceURL).toBe("http://localhost:30100/v1");
    });
});
