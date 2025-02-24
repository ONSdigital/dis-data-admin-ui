import { getLayoutProps, setActiveNavItem } from "./layoutSetup";

test("getLayoutProps returns the correct object", () => {
    const layoutProps = getLayoutProps("/test-url");
    expect(layoutProps.text).toBe("Dataset Catalogue");
    expect(layoutProps.me.displayName).toBe("User 01");
    expect(layoutProps.headerConfig.navigationLinks).toHaveLength(4);
    expect(layoutProps.headerConfig.navigationLinks[0]).toStrictEqual({"text": "Home", "url": "/data-admin"});
    expect(layoutProps.headerConfig.navigationLinks[1]).toStrictEqual({"text": "Dashboard", "url": "/data-admin/dashboard"});
    expect(layoutProps.headerConfig.navigationLinks[2]).toStrictEqual({"text": "Dataset Series", "url": "/data-admin/series"});
    expect(layoutProps.headerConfig.navigationLinks[3]).toStrictEqual({"text": "Upload (POC)", "url": "/data-admin/upload"});
    expect(layoutProps.headerConfig.navigationLinksCurrentPath).toBeNull();
});

describe("setActiveNavItems", () => {
    it("returns null if no param", () => {
        expect(setActiveNavItem()).toBeNull();
    });

    it("returns null if no match", () => {
        expect(setActiveNavItem("/test-url")).toBeNull();
    });

    it("return url if matching", () => {
        expect(setActiveNavItem("/dashboard")).toBe("/data-admin/dashboard");
        expect(setActiveNavItem("/series")).toBe("/data-admin/series");
        expect(setActiveNavItem("/series/dataset-id")).toBe("/data-admin/series");
        expect(setActiveNavItem("/series/foo/bar/test")).toBe("/data-admin/series");
    });
});