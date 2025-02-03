"use client";

import { MainLayout } from "author-design-system-react"

import { logout } from "@/utils/auth/auth";

const mainLayoutProps = {
    text: "Dataset Catalogue",
    me: {
        displayName: 'User 01',
    },
    signOut: () => { logout(); },
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
                text: 'Dataset Series',
                url: '/data-admin/series'
            },
            {
                text: 'Upload (POC)',
                url: '/data-admin/upload'
            },
        ],
    },
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
