import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { logInfo } from "@/utils/log/log";
import { HEADER_USER_ROLES, getLoginURLWithRedirect, validateCookie, getUserRoles } from "@/utils/auth/auth";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/florence/login", "/florence/logout"];

const ID_TOKEN_COOKIE_NAME = "id_token";

export async function authenticationMiddleware(req) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = PUBLIC_ROUTES.includes(path);
    const logData = {
        path,
        method: req.method
    };

    if (isPublicRoute) {
        logInfo("authentication middleware: skipping authentication. accessing public route", logData, null);
        return NextResponse.next();
    }
    
    const cookie = (await cookies()).get(ID_TOKEN_COOKIE_NAME)?.value;
    if (!cookie) {
        logInfo("authentication middleware: no auth cookie found. redirecting to login", logData, null);
        const loginPath = getLoginURLWithRedirect(path);
        return NextResponse.redirect(new URL(loginPath, req.nextUrl));
    }
    
    if (!validateCookie(cookie)) {
        logInfo("authentication middleware: invalid cookie. redirecting to login", logData, null);
        const loginPath = getLoginURLWithRedirect(path);
        return NextResponse.redirect(new URL(loginPath, req.nextUrl));
    }

    const userRoles = getUserRoles(cookie);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set(HEADER_USER_ROLES, userRoles.toString());

    logInfo("authentication middleware: cookie found and validated", logData, null);
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
};
