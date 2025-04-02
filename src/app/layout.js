import { cookies } from 'next/headers'

import Layout from "@/components/layout/Layout";

import getAppConfig from "@/utils/config/config";
import { getUserName } from "@/utils/auth/auth";

export const metadata = {
    title: 'Dataset Catalogue',
    description: 'Discoverable datasets admin UI',
};

export default async function RootLayout({ children }) {
    const appConfig = getAppConfig(process.env);

    const cookieStore = await cookies();
    const token = cookieStore.get('id_token');
    const username = getUserName(token.value);
    return (
        <html lang="en">
            <head>
                <link href="https://cdn.ons.gov.uk/sdc/design-system/69.0.0/css/main.css" rel="stylesheet" type="text/css"/>
            </head>
            <body >
                <Layout appConfig={appConfig} username={username}>
                    {children}
                </Layout>
            </body>
        </html>
    );
};
