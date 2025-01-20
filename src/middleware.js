import { multipleMiddlewares } from './middleware/multipleMiddleware';
import { authenticationMiddleware } from './middleware/authentication';
import { routeLoggingMiddleware } from './middleware/routeLogging';
import { configToClientMiddleware } from './middleware/configToClient';

export const middleware = multipleMiddlewares([
    routeLoggingMiddleware,
    authenticationMiddleware,
    configToClientMiddleware
]);

// applies this middleware only to files in the app directory
export const config = {
    matcher: '/((?!api|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next).*)',
};