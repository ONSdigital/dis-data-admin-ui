"use client";

import { usePathname } from 'next/navigation';

import { MainLayout } from "author-design-system-react";

import { getLayoutProps } from "./layoutSetup";

export default function Layout({ children }) {
    const currentPath = usePathname();
    const mainLayoutProps = getLayoutProps(currentPath);
    return (
          <>
              <MainLayout {...mainLayoutProps}>
                {children}
              </MainLayout>
          </>
    );
}
