import { multipleMiddlewares } from "./proxy/multipleMiddleware";
import { authenticationMiddleware } from "./proxy/authentication";
import { routeLoggingMiddleware } from "./proxy/routeLogging";
import { urlValueHeaders } from "./proxy/urlValueHeaders";

export const middleware = multipleMiddlewares([
    routeLoggingMiddleware,
    authenticationMiddleware,
    urlValueHeaders
]);

// applies this middleware only to files in the app directory
export const config = {
    matcher: "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};