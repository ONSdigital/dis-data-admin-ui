const getAPIRouterURL = (envVars) => {
    return envVars.API_ROUTER_URL ? envVars.API_ROUTER_URL : null;
};

const getUploadBaseURL = (envVars) => {
    const envName = envVars.ENV_NAME;
    if (envName === "sandbox" || envName === "staging" || envName === "prod") {
        return "";
    } else {
        return getAPIRouterURL(envVars);
    }
};

const getAppConfig = (envVars) => {
    const apiRouterURL = getAPIRouterURL(envVars);
    const uploadBaseURL = getUploadBaseURL(envVars);

    return {
        apiRouterURL,
        uploadBaseURL
    }
};

export default getAppConfig;
