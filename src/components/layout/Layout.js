"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { MainLayout } from "author-design-system-react";

import { ConfigContext } from "@/context/context";

import { getLayoutProps } from "./layoutSetup";
import { initAuthRefresh } from "@/utils/auth/authRefresh";

export default function Layout({ appConfig, username, children }) {
    
    const currentPath = usePathname();
    const mainLayoutProps = getLayoutProps(currentPath, username);

    useEffect(() => {
        initAuthRefresh();
    }, []);

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
