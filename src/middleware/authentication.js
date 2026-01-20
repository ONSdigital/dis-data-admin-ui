import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { logInfo } from "@/utils/log/log";
import { HEADER_USER_ROLES, getLoginURLWithRedirect, validateCookie, getUserRoles } from "@/utils/auth/auth";

const publicRoutes = ["/florence/login", "florence/logout"];

export async function authenticationMiddleware(req) {

    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const logData = {path};
    if (isPublicRoute) {
        logInfo("authentication middleware: skipping authication. accessing public route", logData, null);
        return NextResponse.next();
    }
    
    const cookie = (await cookies()).get("id_token")?.value;
    const isValidCookie = validateCookie(cookie);
    if (!cookie || !isValidCookie) {
        logInfo("authentication middleware: no auth cookies found, or invalid. redirecting to login", logData, null);
        const logoutPath = getLoginURLWithRedirect(path);
        return NextResponse.redirect(new URL(logoutPath, req.nextUrl));
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
