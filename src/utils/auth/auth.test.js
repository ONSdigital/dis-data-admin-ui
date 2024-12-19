
import { logout, getLoginURLWithRedirect } from "./auth";


test("logout redirects to the correct url ", () => {
    expect(logout()).toBe("/florence/logout");
});

test("getLoginURLWithRedirect returns the correct url ", () => {
    expect(getLoginURLWithRedirect()).toBe("/florence/login?redirect=%2Fdata-admin%2F");
    expect(getLoginURLWithRedirect("/datasets")).toBe("/florence/login?redirect=%2Fdata-admin%2F%2Fdatasets");
});