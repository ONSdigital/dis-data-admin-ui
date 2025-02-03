import { logout } from "@/utils/auth/auth";

const HEADER_TITLE = "Dataset Catalogue";
const NAVIGATION_OPTIONS = [
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
];

/**
 * Checks current path against list of navigation options
 * @return {string} - path from navigation options
 */
const setActiveNavItem = () => {
    const currentPath = window.location.pathname;
    let activeLink;
    NAVIGATION_OPTIONS.forEach(item => {
        if (currentPath.includes(item.url)) {
            activeLink = item.url;
        }
    })
    return activeLink;
}

/**
 * Returns mapped object that matches mainLayoutProps from design system
 * @return {object} - mainLayoutProps from design system
 */
export default function getLayoutProps() {
    const layout = {
        text: HEADER_TITLE,
        me: {
            displayName: 'User 01',
        },
        signOut: () => { logout(); },
        headerConfig: {
            navigationLinks: NAVIGATION_OPTIONS,
            navigationLinksCurrentPath: setActiveNavItem(),
        },
    };
    return layout;
}