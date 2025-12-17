import { NextResponse } from "next/server";

// we add url values to headers to allow server based Next components to be able to access 
// things like pathname with needing to be converted client components
// see: https://stackoverflow.com/questions/75362636/how-can-i-get-the-url-pathname-on-a-server-component-next-js-13
// see: https://nextjs.org/docs/app/api-reference/functions/use-pathname

const HEADER_URL = "x-request-url";
const HEADER_ORIGIN = "x-request-origin";
const HEADER_PATHNAME = "x-request-pathname";

/**
* @param {Request} request - The incoming request object
* @returns {NextResponse}
*/
export async function urlValueHeaders(req) {
    if (!request?.url) {
        return NextResponse.next();
    }

    const url = new URL(req.url);
    const origin = url.origin;
    const pathname = url.pathname;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set(HEADER_URL, req.url);
    requestHeaders.set(HEADER_ORIGIN, origin);
    requestHeaders.set(HEADER_PATHNAME, pathname);

    return NextResponse.next({
        req: {
            headers: requestHeaders,
        }
    });
}