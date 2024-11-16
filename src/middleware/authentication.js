import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { logInfo } from '@/utils/log/log';

const publicRoutes = ['/florence/login']

export async function authenticationMiddleware(req) {
    const path = req.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const cookie = (await cookies()).get('session')?.value;
    if ((!cookie || cookie === "false") && !isPublicRoute) {
        logInfo("no auth cookie detected redirecting to login screen", null, null);
        return NextResponse.redirect(new URL('/florence/login', req.nextUrl));
    }
    return NextResponse.next();
}