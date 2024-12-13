
const logoutURL = "/florence/logout"
const loginURL = "/florence/login"

/**
 * Redirect to logout endpoint in Florence
 */
const logout = () => {
    return window.location = logoutURL;
}

/**
 * Returns login URL with redirect param set
 * @param {string} redirectPath - path to for redirect param
 */
const getLoginURLWithRedirect = (redirectPath) => {
    const basePath = "/data-admin/";
    const redirect = redirectPath ? redirectPath : "";
    const redirectTo = encodeURIComponent(basePath + redirect);
    return `${loginURL}?redirect=${redirectTo}`;
}

export { logout, getLoginURLWithRedirect };