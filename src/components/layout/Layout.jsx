"use client"

import { usePathname } from 'next/navigation'

import { MainLayout } from "author-design-system-react"

import { logout } from "@/utils/auth/auth";

import DatasetsToolbar from "@/components/toolbar/DatasetsToolbar";

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
                text: 'Datasets',
                url: '/data-admin/datasets'
            },
        ],
    }
};

export default function Layout({ children }) {
    const pathname = usePathname()
    if (pathname == '/datasets'){
        mainLayoutProps.headerConfig.toolbar = <DatasetsToolbar></DatasetsToolbar>
    } else {
        mainLayoutProps.headerConfig.toolbar = undefined
    }

    return (
          <>
              <MainLayout {...mainLayoutProps}>
                  {children}
              </MainLayout>
          </>
    )
}