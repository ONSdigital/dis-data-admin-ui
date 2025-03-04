"use client";

import { usePathname } from 'next/navigation';

import { MainLayout } from "author-design-system-react";

import { ConfigContext } from '@/context/context';

import { getLayoutProps } from "./layoutSetup";

export default function Layout({ appConfig, children }) {
    const currentPath = usePathname();
    const mainLayoutProps = getLayoutProps(currentPath);
    return (
        <>  
            <ConfigContext.Provider value={appConfig}>
                <MainLayout {...mainLayoutProps}>
                    {children}
                </MainLayout>
            </ConfigContext.Provider>
        </>
    );
}
