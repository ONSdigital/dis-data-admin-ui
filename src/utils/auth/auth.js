import { jwtDecode } from "jwt-decode";

import { logInfo, logError } from "../log/log";

const HEADER_USER_ROLES = "x-user-roles";
const ROLE_ADMIN = "role-admin";
const ROLE_PUBLISHER = "role-publisher";

const LOGOUT_URL = "/florence/logout";
const LOGIN_URL = "/florence/login";

// property name in the JWT where we can find user roles
const COGNITO_GROUPS_CLAIM = "cognito:groups";

// convert unix timestamp to milliseconds rather than seconds
const MILLISECONDS_MULTIPLIER = 1000;

/**
 * Redirect to logout endpoint in Florence
 * @return {string} - The logout URL (assignment return value)
 */
const logout = () => {
    logInfo("user clicked logout", null, null, null);
    return window.location.href = LOGOUT_URL;
};

/**
 * Returns login URL with redirect param set
 * @param  {string} redirectPath - path for redirect param
 * @return {string} - encoded login string with redirect param
 */
const getLoginURLWithRedirect = (redirectPath) => {
    const basePath = "/data-admin/";
    const redirect = redirectPath || "";
    const redirectTo = encodeURIComponent(basePath + redirect);
    return `${LOGIN_URL}?redirect=${redirectTo}`;
};

/**
 * Decodes JWT token
 * @param  {string} token - JWT cookie value
 * @return {object} - Decoded JWT payload
 */
const decodeToken = (token) => {
    return jwtDecode(token);
};

/**
 * Decodes JWT and validates cookies expiry date
 * @param  {string} token - JWT cookie value
 * @return {boolean} - True if token is valid and not expired, false otherwise
 */
const validateCookie = (token) => {
    if (!token || typeof token !== "string") {
        return false;
    }
    try {
        const cookie = decodeToken(token);
        if (cookie?.exp * MILLISECONDS_MULTIPLIER < Date.now()) {
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
 * @param  {string} token - JWT cookie value
 * @return {string|null} - Formatted user name (given_name + family_name) or null if error
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
 * Decodes user roles from token
 * @param  {string} token - JWT cookie value
 * @return {Array<string>|null} - Array of user roles from cognito:groups, or null if error
 */
const getUserRoles = (token) => {
    try {
        const cookie = decodeToken(token);
        return cookie[COGNITO_GROUPS_CLAIM] || [];
    } catch (error) {
        logError("error getting user role from token", null, null, error);
        return null;
    }
};

/**
 * Checks if a user has a specific role based on role header string
 * @param  {string} roleHeader - Comma-separated string of roles (e.g., "role-admin,role-publisher")
 * @param  {string} role - The role to check for
 * @return {boolean} - True if user has the specified role, false otherwise
 */
const userHasRole = (roleHeader, role) => {
    if (!roleHeader) return false;
    const roles = roleHeader.split(",").map(r => r.trim());
    return roles.includes(role);
};

/**
 * Checks if a user has admin role
 * @param  {string} roleHeader - Comma-separated string of roles
 * @return {boolean} - True if user has admin role, false otherwise
 */
const userIsAdmin = (roleHeader) => userHasRole(roleHeader, ROLE_ADMIN);

/**
 * Checks if a user has publisher role
 * @param  {string} roleHeader - Comma-separated string of roles
 * @return {boolean} - True if user has publisher role, false otherwise
 */
const userIsPublisher = (roleHeader) => userHasRole(roleHeader, ROLE_PUBLISHER);

export { HEADER_USER_ROLES, logout, getLoginURLWithRedirect, decodeToken, validateCookie, getUserName, getUserRoles, userIsAdmin, userIsPublisher };
