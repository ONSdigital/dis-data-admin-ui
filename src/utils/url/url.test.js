import { getDistributionPath, getURLPath } from "./url";

describe("getURLPath", () => {
    test("returns null for empty values", () => {
        expect(getURLPath(null)).toBeNull();
        expect(getURLPath(undefined)).toBeNull();
        expect(getURLPath("")).toBeNull();
    });

    test("returns the path without a leading slash for absolute URLs", () => {
        const result = getURLPath("https://example.com/path/to/test.csv");
        expect(result).toBe("path/to/test.csv");
    });

    test("returns the path without a leading slash for relative URLs", () => {
        const result = getURLPath("/path/to/test.csv");
        expect(result).toBe("path/to/test.csv");
    });

    test("returns the path without a leading slash relative URLs without leading slash", () => {
        const result = getURLPath("path/to/test.csv");
        expect(result).toBe("path/to/test.csv");
    });

    test("returns null for invalid URLs", () => {
        const result = getURLPath("http://");
        expect(result).toBeNull();
    });
});

describe("getDistributionPath", () => {
    test("returns null for empty values", () => {
        expect(getDistributionPath(null)).toBeNull();
        expect(getDistributionPath(undefined)).toBeNull();
        expect(getDistributionPath("")).toBeNull();
    });

    test("returns uuid/filename from an absolute URL", () => {
        const result = getDistributionPath("https://example.com/downloads/files/uuid/report.csv");
        expect(result).toBe("uuid/report.csv");
    });

    test("returns uuid/filename from a relative download path", () => {
        const result = getDistributionPath("/downloads/files/uuid/report.csv");
        expect(result).toBe("uuid/report.csv");
    });

    test("returns uuid/filename from a relative path without downloads prefix", () => {
        const result = getDistributionPath("uuid/report.csv");
        expect(result).toBe("uuid/report.csv");
    });

    test("returns remaining path when no filename segment", () => {
        const result = getDistributionPath("/downloads/files/uuid");
        expect(result).toBe("uuid");
    });

    test("returns null for invalid URLs", () => {
        const result = getDistributionPath("http://");
        expect(result).toBeNull();
    });
});
