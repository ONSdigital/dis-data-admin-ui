"use client";

import { MainLayout } from "author-design-system-react";

import getLayoutProps from "./layoutSetup"

const mainLayoutProps = getLayoutProps();

export default function Layout({ children }) {
    return (
          <>
              <MainLayout {...mainLayoutProps}>
                {children}
              </MainLayout>
          </>
    )
}
