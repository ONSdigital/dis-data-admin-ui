import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'

import { logInfo } from '@/utils/log/log';
import { getLoginURLWithRedirect } from '@/utils/auth/auth';

const publicRoutes = ['/florence/login']

export async function authenticationMiddleware(req) {
    const path = req.nextUrl.pathname
    const isPublicRoute = publicRoutes.includes(path)
    const cookie = (await cookies()).get('session')?.value
    if ((!cookie || cookie === "false") && !isPublicRoute) {
        logInfo("no auth cookies found, or invalid. redirecting to login", null, null);
        const logoutPath = getLoginURLWithRedirect(path)
        console.log(logoutPath)
        return NextResponse.redirect(new URL(logoutPath, req.nextUrl))
    }
    return NextResponse.next();
}