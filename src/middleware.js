import { multipleMiddlewares } from "./middleware/multipleMiddleware";
import { authenticationMiddleware } from "./middleware/authentication";
import { routeLoggingMiddleware } from "./middleware/routeLogging";
import { pathnameHeader } from "./middleware/pathnameHeader";

export const middleware = multipleMiddlewares([
    routeLoggingMiddleware,
    authenticationMiddleware,
    pathnameHeader
]);

// applies this middleware only to files in the app directory
export const config = {
    matcher: "/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)",
};