import { NextResponse } from 'next/server';
import { logEvent } from '@/utils/log/log';


export async function routeLoggingMiddleware(req) {
    logEvent(`Route changed: ${req.url}`)
    return NextResponse.next();
}