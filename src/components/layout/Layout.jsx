"use client"

import { MainLayout } from "author-design-system-react"

import { logout } from "@/utils/auth/auth";

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
    return (
          <>
              <MainLayout {...mainLayoutProps}>
                  {children}
              </MainLayout>
          </>
    )
}