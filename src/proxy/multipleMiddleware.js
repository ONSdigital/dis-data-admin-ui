// function for handling mutltiple middleware since next only supports one
// taken/modified from https://medium.com/@aididalam/approach-to-multiple-middleware-and-auth-guard-in-next-js-app-routing-bbb641401477
// see also https://stackoverflow.com/a/78980557

import { NextResponse } from "next/server";

export const multipleMiddlewares = (middlewares) => async (req, event, response) => {
    // Array to store middleware results
    const middlewareResults = [];
    // Track all request headers that need to be passed through
    const allRequestHeaders = new Headers(req.headers);

    // Loop through middleware functions
    for (const middleware of middlewares) {
        // Execute middleware function and await the result
        const result = await middleware(req, event, response);

        // Check if the result is not okay and return it
        if (!result.ok) {
            return result;
        }

        // Store the result
        middlewareResults.push(result);

        // Extract and merge request headers from this middleware's response
        // When NextResponse.next({ request: { headers } }) is called, 
        // those headers should be merged into the request for subsequent middlewares
        // We need to track them to pass them through
        const responseRequestHeaders = result.request?.headers;
        if (responseRequestHeaders) {
            for (const [key, value] of responseRequestHeaders.entries()) {
                // Use set instead of append to avoid comma-separated duplicates
                allRequestHeaders.set(key, value);
            }
        }
    }

    // Merge all the headers to check if there is a redirection or rewrite
    const mergedHeaders = new Headers();

    // Merge all the custom headers added by the middlewares
    const transmittedHeaders = new Headers();

    // Merge response headers from all middleware results
    middlewareResults.forEach((result) => {
        for (const [key, value] of result.headers.entries()) {
            // Use set instead of append to avoid comma-separated duplicates
            mergedHeaders.set(key, value);

            // check if its a custom header added by one of the middlewares
            if (key.startsWith("x-middleware-request-")) {
                // remove the prefix to get the original key
                const fixedKey = key.replace("x-middleware-request-", "");

                // add the original key to the transmitted headers
                // Use set instead of append to avoid comma-separated duplicates
                transmittedHeaders.set(fixedKey, value);
            }
        }
    });

    // Merge transmittedHeaders with allRequestHeaders
    // transmittedHeaders takes precedence for x-middleware-request-* headers
    for (const [key, value] of allRequestHeaders.entries()) {
        if (!transmittedHeaders.has(key)) {
            transmittedHeaders.set(key, value);
        }
    }

    // Initialize a NextResponse object
    return NextResponse.next({
        request: {
            headers: transmittedHeaders,
        },
    });
};