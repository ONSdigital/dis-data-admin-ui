"use client"
import { MainLayout } from "author-design-system-react"

const mainLayoutProps = {
    text: "Dataset Catalogue",
    me: {
        displayName: 'User 01',
    },
    headerConfig: {
        navigationLinks: [
            {
                text: 'Home',
                url: '/'
            },
            {
                text: 'Dashboard',
                url: '/dashboard'
            },
            {
                text: 'Datasets',
                url: '/datasets'
            },
        ]
    }
};

export default function Layout({ children }) {
    return (
          <>
              <MainLayout {...mainLayoutProps}>
                  <main>{children}</main>
              </MainLayout>
          </>
    )
}