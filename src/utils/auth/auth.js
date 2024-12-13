import { jwtDecode } from "jwt-decode";

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
 * @param  {Cookie} cookie - cookie value
 * @return {boolean}
 */
const validateCookie = (cookie) => {
    try {
        jwtDecode(cookie);
        return true;
    } catch (err) {
        console.log("WE'RE IN HERE!!")
        return false;
    }
}


export { logout, getLoginURLWithRedirect, validateCookie };