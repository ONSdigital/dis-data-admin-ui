import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * adds serverside configuration to cookies so that can be read by any client side code
 */
export async function configToClientMiddleware() {
    let apiRouterURL = process.env.API_ROUTER_URL;
    const env = process.env.ENV_NAME;
    if (env === "sandbox" || env === "staging" || env === "prod") {
        const apiRouterParsedURL = new URL(apiRouterURL);
        apiRouterParsedURL.protocol = "https:";
        apiRouterURL = apiRouterParsedURL.toString();
    }
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'api_router_url',
        value: apiRouterURL,
        path: '/',
    });
    return NextResponse.next();
};
