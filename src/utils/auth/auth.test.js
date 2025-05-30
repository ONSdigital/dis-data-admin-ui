import { logout, getLoginURLWithRedirect, decodeToken, validateCookie, getUserName } from "./auth";
import { createValidJWTCookieValue, createExpiredJWTCookieValue, createValidJWTCookieValueWithUserDetails } from "../../../tests/utils/utils";


test("logout redirects to the correct url ", () => {
    expect(logout()).toBe("/florence/logout");
});

test("getLoginURLWithRedirect returns the correct url ", () => {
    expect(getLoginURLWithRedirect()).toBe("/florence/login?redirect=%2Fdata-admin%2F");
    expect(getLoginURLWithRedirect("/datasets")).toBe("/florence/login?redirect=%2Fdata-admin%2F%2Fdatasets");
});

test("decode cookie returns a decoded cookie ", () => {
    const decoded = decodeToken(createValidJWTCookieValue());
    expect(decoded.data).toBe("test");
    const expectedExpiry = Math.floor(Date.now() / 1000) + (60 * 60);
    expect(decoded.exp).toBe(expectedExpiry);
});

test("decode cookie returns a decoded cookie ", () => {
    const userDetails = getUserName(createValidJWTCookieValueWithUserDetails("Test", "User"));
    expect(userDetails).toBe("Test User");
});


describe("validateCookie", () => {
    it("returns false if no cookie", () => {
        const cookieValue = null;
        expect(validateCookie(cookieValue)).toBe(false);
    });

    it("returns false if cookie is valid but expired", () => {
        const cookieValue = createExpiredJWTCookieValue();
        expect(validateCookie(cookieValue)).toBe(false);
    });

    it("returns true if valid cookie and not expired", () => {
        const cookieValue = createValidJWTCookieValue();
        expect(validateCookie(cookieValue)).toBe(true);
    });
});
