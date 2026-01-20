import { jwtDecode } from "jwt-decode";

import { logInfo, logError } from "../log/log";

const HEADER_USER_ROLES = "x-user-roles";
const ROLE_ADMIN = "role-admin";
const ROLE_PUBLISHER = "role-publisher";

const logoutURL = "/florence/logout";
const loginURL = "/florence/login";

// convert unix timestamp to milliseconds rather than seconds
const millisecondsMultiplier = 1000;

/**
 * Redirect to logout endpoint in Florence
 */
const logout = () => {
    logInfo("user clicked logout", null, null, null);
    return window.location = logoutURL;
};

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
};

/**
 * Decodes JWT token
 * @param  {JWT} token - JWT cookie value
 * @return {object}
 */
const decodeToken = (token) => {
    return jwtDecode(token);
};

/**
 * Decodes JWT and validates cookies expiry date
 * @param  {JWT} jwt - JWT cookie value
 * @return {boolean}
 */
const validateCookie = (token) => {
    try {
        const cookie = decodeToken(token);
        if (cookie?.exp * millisecondsMultiplier < Date.now()) {
            return false;
        }
        return true;
    } catch (error) {
        logError("error validating auth cookie", null, null, error);
        return false;
    }
};

/**
 * Decodes user given and family name from token
 * @param  {JWT} jwt - JWT cookie value
 * @return {string} - Formatted user name
 */
const getUserName = (token) => {
    try {
        const cookie = decodeToken(token);
        return cookie.given_name + " " + cookie.family_name;
    } catch (error) {
        logError("error getting user name from token", null, null, error);
        return null;
    }
};

/**
 * Decodes user given and family name from token
 * @param  {JWT} jwt - JWT cookie value
 * @return {string} - Formatted user name
 */
const getUserRoles = (token) => {
    try {
        const cookie = decodeToken(token);
        return cookie["cognito:groups"];
    } catch (error) {
        logError("error getting user role from token", null, null, error);
        return null;
    }
};

const userIsAdmin = (roleHeader) => {
    if (!roleHeader) return false;
    const roles = roleHeader.split(",");
    if (roles.includes(ROLE_ADMIN)) return true;
    return false;
}

const userIsPublisher = (roleHeader) => {
    if (!roleHeader) return false;
    const roles = roleHeader.split(",");
    if (roles.includes(ROLE_PUBLISHER)) return true;
    return false;
}


export { HEADER_USER_ROLES, logout, getLoginURLWithRedirect, decodeToken, validateCookie, getUserName, getUserRoles, userIsAdmin, userIsPublisher };
