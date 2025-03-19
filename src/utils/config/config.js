/**
 * Map API_ROUTER_URL environment variable
 * @param {object} envVars - environment variables
 * @return {string} - API Router value or null
 */
const getAPIRouterURL = (envVars) => {
    return envVars.API_ROUTER_URL ? envVars.API_ROUTER_URL : null;
};

/**
 * Get upload base url for upload component. 
 * @param {object} envVars - environment variables
 * @return {string} - empty if we're in an environment, use API_ROUTER_URL if local
 */
const getUploadBaseURL = (envVars) => {
    const envName = envVars.ENV_NAME;
    if (envName === "sandbox" || envName === "staging" || envName === "prod") {
        return "/api/v1";
    } else {
        return getAPIRouterURL(envVars);
    }
};

/**
 * Get app config object 
 * @param {object} envVars - environment variables
 * @return {object} - mapped variables for use throughout app
 */
const getAppConfig = (envVars) => {
    const apiRouterURL = getAPIRouterURL(envVars);
    const uploadBaseURL = getUploadBaseURL(envVars);

    return {
        apiRouterURL,
        uploadBaseURL
    };
};

export default getAppConfig;
// for testing
export { getAPIRouterURL, getUploadBaseURL };
