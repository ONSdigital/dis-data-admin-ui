import { logError } from "./log/log";

function getURLPath(url) {
    if (!url) {
        return null;
    }

    try {
        const parsedUrl = new URL(url, "https://example.com");
        return parsedUrl.pathname.replace(/^\/+/, "");
    } catch (error) {
        logError("failed to parse url", { url }, null, error);
        return null;
    }
}

function getDistributionPath(url) {
    const path = getURLPath(url);

    if (!path) {
        return null;
    }

    const segments = path.split("/").filter(Boolean);

    // Remove the /downloads/files prefix if it exists as this is added by the API
    if (segments[0] === "downloads" && segments[1] === "files") {
        return segments.slice(2).join("/");
    }

    return segments.join("/");
}

export { getURLPath, getDistributionPath };
