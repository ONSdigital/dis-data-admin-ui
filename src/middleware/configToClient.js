import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * adds serverside configuration to cookies so that can be read by any client side code
 */
export async function configToClientMiddleware() {
    const apiRouterURL = process.env.API_ROUTER_URL;
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'api_router_url',
        value: apiRouterURL,
        path: '/',
    });
    return NextResponse.next();
};
