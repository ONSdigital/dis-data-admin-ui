import { generateBreadcrumb } from "./breadcrumb";

describe("generateBreadcrumb", () => {
    it("returns expected breadcrumb object when url length is less than 4 ", () => {
        const url = "/series";
        const breadcrumb = generateBreadcrumb(url, "Test dataset", null)
        expect(breadcrumb).toHaveLength(1);
        expect(breadcrumb[0].url).toBe("/data-admin/series");
        expect(breadcrumb[0].text).toBe("Dataset catalogue");
    });

    it("returns expected breadcrumb object when url length is greater than or equal to 4 ", () => {
        const url = "/series/test-dataset/editions/test-edition";
        const breadcrumb = generateBreadcrumb(url, "Test dataset", "Test edition")
        expect(breadcrumb).toHaveLength(2);
        expect(breadcrumb[1].url).toBe("/data-admin/series/test-dataset");
        expect(breadcrumb[1].text).toBe("Test dataset");
    });

    it("returns expected breadcrumb object when url length is greater than or equal to 6 ", () => {
        const url = "/series/test-dataset/editions/test-edition/versions/1";
        const breadcrumb = generateBreadcrumb(url, "Test dataset", "Test edition")
        expect(breadcrumb).toHaveLength(3);
        expect(breadcrumb[2].url).toBe("/data-admin/series/test-dataset/editions/test-edition");
        expect(breadcrumb[2].text).toBe("Test edition");
    });

    it("returns expected breadcrumb object when url length is greater than or equal to 8 ", () => {
        const url = "/series/test-dataset/editions/test-edition/versions/1/foo/bar";
        const breadcrumb = generateBreadcrumb(url, "Test dataset", "Test edition")
        expect(breadcrumb).toHaveLength(4);
        expect(breadcrumb[3].url).toBe("/data-admin/series/test-dataset/editions/test-edition/versions/1");
        expect(breadcrumb[3].text).toBe("1");
    });
});
