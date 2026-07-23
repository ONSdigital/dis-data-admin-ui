import { multipleProxies } from "./proxy/multipleProxy";
import { authenticationProxy } from "./proxy/authentication";
import { routeLoggingProxy } from "./proxy/routeLogging";
import { urlValueHeaders } from "./proxy/urlValueHeaders";

export const proxy = multipleProxies([
    routeLoggingProxy,
    authenticationProxy,
    urlValueHeaders
]);

// applies this proxy only to files in the app directory
export const config = {
    matcher: "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};