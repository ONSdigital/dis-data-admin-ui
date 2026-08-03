const defaults = {
    API_ROUTER_URL: "http://localhost:23200/v1",
    API_ROUTER_URL_FOR_CLIENT: "http://localhost:23200/v1",
    ENV_NAME: "dev",
    MIGRATION_SERVICE_URL: "http://localhost:30100/",
};

/**
 * Get app config object 
 * @param {object} envVars - environment variables
 * @return {object} - mapped variables for use throughout app
 */
const getAppConfig = (envVars) => {
    return {
        apiRouterURL: envVars.API_ROUTER_URL || defaults.API_ROUTER_URL,
        apiRouterURLForClient: envVars.API_ROUTER_URL_FOR_CLIENT || defaults.API_ROUTER_URL_FOR_CLIENT,
        envName: envVars.ENV_NAME || defaults.ENV_NAME,
        migrationServiceURL: envVars.MIGRATION_SERVICE_URL || defaults.MIGRATION_SERVICE_URL,
    };
};

export default getAppConfig;
