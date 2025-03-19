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
    console.log("envName is:", envName, "envVars.ENV_NAME is:", envVars.ENV_NAME);
    if (envName === "sandbox" || envName === "staging" || envName === "prod") {
        console.log("inside envName conditional. returning empty string ");
        return "";
    } else {
        console.log("NOT inside envName conditional. returning API_ROUTER_URL ");
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
    console.log("uploadBaseURL is:", uploadBaseURL);
    return {
        apiRouterURL,
        uploadBaseURL
    };
};

export default getAppConfig;
// for testing
export { getAPIRouterURL, getUploadBaseURL };
