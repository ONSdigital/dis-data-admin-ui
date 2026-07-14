import { NextResponse } from "next/server";
import { logInfo } from "@/utils/log/log";


export async function routeLoggingMiddleware(req) {
    logInfo("route change", {url: req.url}, null);
    return NextResponse.next();
}