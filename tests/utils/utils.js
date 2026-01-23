import jwt from "jsonwebtoken";

const EXPIRED_COOKIE_DATE = Math.floor(Date.now() / 1000) - (60 * 60);
const UNEXPIRED_COOKIE_DATE = Math.floor(Date.now() / 1000) + (60 * 60);

const createJWTCookieValue = (expiry, givenName, familyName, roles) => {
    return jwt.sign({
        exp: expiry,
        data: "test",
        given_name: givenName || "GivenName",
        family_name: familyName || "FamilyName",
        "cognito:groups": roles?.length ? roles : []
    }, "secret");
}

const createExpiredJWTCookieValue = () => {
    return createJWTCookieValue(EXPIRED_COOKIE_DATE);
}

const createValidJWTCookieValue = () => {
    return createJWTCookieValue(UNEXPIRED_COOKIE_DATE);
}

const createValidJWTCookieValueWithUserDetails = (givenName, familyName) => {
    return createJWTCookieValue(UNEXPIRED_COOKIE_DATE, givenName, familyName, null);
}

const setAuthCookies = async (browserContext, expiry, givenName, familyName, roles) => {
    await browserContext.addCookies([
        { name: "id_token", value: createJWTCookieValue(expiry, givenName, familyName, roles), path: "/",  domain: "127.0.0.1"},
        { name: "access_token", value: createJWTCookieValue(expiry, givenName, familyName, roles), path: "/",  domain: "127.0.0.1"}
    ]);
};

const setValidAdminAuthCookies = async (browserContext, givenName = "Test", familyName = "Name") => {
    setAuthCookies(browserContext, UNEXPIRED_COOKIE_DATE, givenName, familyName, ["role-admin"]);
};

const setValidPublisherAuthCookies = async (browserContext, givenName = "Test", familyName = "Name") => {
    setAuthCookies(browserContext, UNEXPIRED_COOKIE_DATE, givenName, familyName, ["role-publisher"]);
};

const setValidAuthCookies = async (browserContext, givenName = "Test", familyName = "Name") => {
    setAuthCookies(browserContext, UNEXPIRED_COOKIE_DATE, givenName, familyName, ["role-publisher"]);
};

const setExpiredAuthCookies = async (browserContext, givenName = "Test", familyName = "Name") => {
    setAuthCookies(browserContext,  EXPIRED_COOKIE_DATE, givenName, familyName, []);
};

export { 
    createExpiredJWTCookieValue, 
    createValidJWTCookieValue, 
    createValidJWTCookieValueWithUserDetails, 
    setValidAdminAuthCookies, 
    setValidPublisherAuthCookies, 
    setValidAuthCookies, 
    setExpiredAuthCookies 
}