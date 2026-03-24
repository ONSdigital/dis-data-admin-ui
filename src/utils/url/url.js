import { logError } from "../log/log";

const getURLPath = (url) => {
    if (!url) {
        return null;
    }

    try {
        // The URL constructor requires a base for relative paths.
        // "thismessage:/" is used to avoid implying a real site.
        // See: https://www.w3.org/wiki/UriSchemes/thismessage
        const parsedUrl = new URL(url, "thismessage:/");
        return parsedUrl.pathname.replace(/^\/+/, "");
    } catch (error) {
        logError("failed to parse url", { url }, null, error);
        return null;
    }
};

const getDistributionPath = (url) => {
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
};

export { getURLPath, getDistributionPath };
