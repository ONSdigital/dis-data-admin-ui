import { multipleMiddlewares } from "./middleware/multipleMiddleware";
import { authenticationMiddleware } from "./middleware/authentication";
import { routeLoggingMiddleware } from "./middleware/routeLogging";
import { urlValueHeaders } from "./middleware/urlValueHeaders";

export const middleware = multipleMiddlewares([
    routeLoggingMiddleware,
    authenticationMiddleware,
    urlValueHeaders
]);

// applies this middleware only to files in the app directory
export const config = {
    matcher: "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};