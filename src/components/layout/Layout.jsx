"use client"

import { usePathname } from 'next/navigation'

import { MainLayout } from "author-design-system-react"

import { logout } from "@/utils/auth/auth";

import HeroPanel from "@/components/heroPanel/HeroPanel";

const mainLayoutProps = {
    text: "Dataset Catalogue",
    me: {
        displayName: 'User 01',
    },
    signOut: () => { logout() },
    headerConfig: {
        navigationLinks: [
            {
                text: 'Home',
                url: '/data-admin'
            },
            {
                text: 'Dashboard',
                url: '/data-admin/dashboard'
            },
            {
                text: 'Series',
                url: '/data-admin/series'
            },
        ],
    },
    pageConfig: {

    }
};

export default function Layout({ children }) {
    const pathname = usePathname()
    switch (pathname) {
        case "/series":
            mainLayoutProps.pageConfig = {heroPanel: <HeroPanel title="Dataset Series" wide/>};
            break;
        }
    
    return (
          <>
              <MainLayout {...mainLayoutProps}>
                  {children}
              </MainLayout>
          </>
    )
}
