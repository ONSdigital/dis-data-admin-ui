import Layout from "@/components/layout/Layout";

import getAppConfig from "@/utils/config/config";

export const metadata = {
    title: 'Dataset Catalogue',
    description: 'Discoverable datasets admin UI',
};

export default function RootLayout({ children }) {
    const appConfig = getAppConfig(process.env);
    return (
        <html lang="en">
            <head>
                <link href="https://cdn.ons.gov.uk/sdc/design-system/69.0.0/css/main.css" rel="stylesheet" type="text/css"/>
            </head>
            <body >
                <Layout appConfig={appConfig}>
                    {children}
                </Layout>
            </body>
        </html>
    );
};
