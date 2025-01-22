import Layout from "@/components/layout/Layout";

export const metadata = {
    title: 'Dataset Catalogue',
    description: 'Discoverable datasets admin UI',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link href="https://cdn.ons.gov.uk/sdc/design-system/69.0.0/css/main.css" rel="stylesheet" type="text/css"/>
            </head>
            <body >
                <Layout>
                    {children}
                </Layout>
            </body>
        </html>
    );
};
