import { logout, getLoginURLWithRedirect, decodeToken, validateCookie, getUserName, getUserRoles, userIsAdmin, userIsPublisher } from "./auth";
import { createValidJWTCookieValue, createExpiredJWTCookieValue, createValidJWTCookieValueWithUserDetails } from "../../../tests/utils/utils";
import jwt from "jsonwebtoken";


// mock dis-authorisation-client-js library as it's an ESM and causing issues with Jest
jest.mock("dis-authorisation-client-js", () => ({
    SessionManagement: jest.fn(),
}));

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

    it("returns false if cookie value is not a string", () => {
        expect(validateCookie({})).toBe(false);
    });
});

describe("getUserRoles", () => {
    it("returns roles from cognito:groups claim when present", () => {
        const expiry = Math.floor(Date.now() / 1000) + (60 * 60);
        const token = jwt.sign(
            {
                exp: expiry,
                data: "test",
                "cognito:groups": ["role-admin", "role-publisher"],
            },
            "secret"
        );

        expect(getUserRoles(token)).toEqual(["role-admin", "role-publisher"]);
    });

    it("returns an empty array when token cannot be decoded", () => {
        const invalidToken = "not-a-valid-jwt";
        expect(getUserRoles(invalidToken)).toEqual([]);
    });
});

describe("user role helpers", () => {
    it("userIsAdmin returns true when admin role present", () => {
        const header = "role-viewer, role-admin, role-publisher";
        expect(userIsAdmin(header)).toBe(true);
    });

    it("userIsAdmin returns false when admin role missing", () => {
        const header = "role-viewer, role-publisher";
        expect(userIsAdmin(header)).toBe(false);
    });

    it("userIsPublisher returns true when publisher role present", () => {
        const header = "role-viewer, role-publisher";
        expect(userIsPublisher(header)).toBe(true);
    });

    it("userIsPublisher returns false when header is empty or undefined", () => {
        expect(userIsPublisher("")).toBe(false);
        expect(userIsPublisher(undefined)).toBe(false);
    });
});
