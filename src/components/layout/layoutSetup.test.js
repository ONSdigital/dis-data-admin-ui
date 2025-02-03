import { getLayoutProps, setActiveNavItem } from "./layoutSetup";


test("getLayoutProps returns the correct object", () => {
    const layoutProps = getLayoutProps();
    expect(layoutProps.text).toBe("Dataset Catalogue");
    expect(layoutProps.me.displayName).toBe("User 01");
    expect(layoutProps.headerConfig.navigationLinks).toHaveLength(3);
    expect(layoutProps.headerConfig.navigationLinksCurrentPath).toBeNull();
});

describe("setActiveNavItems", () => {
    it("returns null if no match", () => {
        expect(setActiveNavItem("test-url")).toBeNull();
    });

    it("return url if matching", () => {
        expect(setActiveNavItem("/dashboard")).toBe("/data-admin/dashboard");
        expect(setActiveNavItem("series")).toBe("/data-admin/series");
    });
});