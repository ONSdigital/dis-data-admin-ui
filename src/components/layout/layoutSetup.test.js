import { getLayoutProps, setActiveNavItem } from "./layoutSetup";

test("getLayoutProps returns the correct object", () => {
    const layoutProps = getLayoutProps("/test-url", "Test user");
    expect(layoutProps.text).toBe("Dataset Catalogue Manager");
    expect(layoutProps.me.displayName).toBe("Test user");
    expect(layoutProps.headerConfig.navigationLinks).toHaveLength(2);
    expect(layoutProps.headerConfig.navigationLinks[0]).toStrictEqual({"text": "Home", "url": "/data-admin"});
    expect(layoutProps.headerConfig.navigationLinks[1]).toStrictEqual({"text": "Dataset catalogue", "url": "/data-admin/series"});
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
        expect(setActiveNavItem("/series")).toBe("/data-admin/series");
        expect(setActiveNavItem("/series/dataset-id")).toBe("/data-admin/series");
        expect(setActiveNavItem("/series/foo/bar/test")).toBe("/data-admin/series");
    });
});