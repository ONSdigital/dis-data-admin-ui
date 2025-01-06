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

export {createExpiredJWTCookieValue, createValidJWTCookieValue}
