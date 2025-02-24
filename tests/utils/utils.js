import jwt from "jsonwebtoken";

const createJWTCookieValue = (expiry) => {
    return jwt.sign({
        exp: expiry,
        data: 'test'
    }, 'secret');
}

const createExpiredJWTCookieValue = () => {
    return createJWTCookieValue(Math.floor(Date.now() / 1000) - (60 * 60));
}

const createValidJWTCookieValue = () => {
    return createJWTCookieValue(Math.floor(Date.now() / 1000) + (60 * 60));
}

const addValidAuthCookies = async (browserContext) => {
    await browserContext.addCookies([
        { name: 'id_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'},
        { name: 'access_token', value: createValidJWTCookieValue(), path: '/',  domain: '127.0.0.1'}
    ]);
};

export { addValidAuthCookies, createExpiredJWTCookieValue, createValidJWTCookieValue }
