"use client"

import { usePathname, useRouter } from 'next/navigation'

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
    const router = useRouter()

    switch (pathname) {
        case "/series":
            mainLayoutProps.pageConfig = {heroPanel: <HeroPanel button={{onClick: () => {router.push('/series/create')}, text: "Create New Dataset Series"}} title="Dataset Series" wide/>};
            break;
        default:
            mainLayoutProps.pageConfig = {}
        }
    
    return (
          <>
              <MainLayout {...mainLayoutProps}>
                  {children}
              </MainLayout>
          </>
    )
}
