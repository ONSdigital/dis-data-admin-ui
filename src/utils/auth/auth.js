import { jwtDecode } from "jwt-decode";

import { logError } from "../log/log";

const logoutURL = "/florence/logout"
const loginURL = "/florence/login"

// convert unix timestamp to milliseconds rather than seconds
const millisecondsMultiplier = 1000;

/**
 * Redirect to logout endpoint in Florence
 */
const logout = () => {
    return window.location = logoutURL;
}

/**
 * Returns login URL with redirect param set
 * @param  {string} redirectPath - path for redirect param
 * @return {string} - encoded login string with redirect param
 */
const getLoginURLWithRedirect = (redirectPath) => {
    const basePath = "/data-admin/";
    const redirect = redirectPath ? redirectPath : "";
    const redirectTo = encodeURIComponent(basePath + redirect);
    return `${loginURL}?redirect=${redirectTo}`;
}

/**
 * Decodes JWT and validates
 * @param  {JWT} jwt - JWT cookie value
 * @return {boolean}
 */
const validateCookie = (token) => {
    try {
        const cookie = jwtDecode(token);
        if (cookie?.exp * millisecondsMultiplier < Date.now()) {
            return false
        }
        return true;
    } catch (error) {
        logError("error validating auth cookie", null, null, error)
        return false;
    }
}

export { logout, getLoginURLWithRedirect, validateCookie };
