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
    {
        text: 'Upload (POC)',
        url: '/data-admin/upload'
    },
];

/**
 * Checks current path against list of navigation options
 * @param  {string} currentPath - path of current page
 * @return {string} - path from navigation options
 */
const setActiveNavItem = (currentPath) => {
    let activeLink = null;
    NAVIGATION_OPTIONS.forEach(item => {
        const navOptionRoot = item.url.split("/data-admin")[1];
        if (currentPath.includes(navOptionRoot)) {
            activeLink = item.url;
        }
    });
    return activeLink;
};

/**
 * Returns mapped object that matches mainLayoutProps from design system
 * @param  {string} currentPath - path of current page
 * @return {object} - mainLayoutProps from design system
 */
const getLayoutProps = (currentPath) => {
    const layout = {
        text: HEADER_TITLE,
        me: {
            displayName: 'User 01',
        },
        signOut: () => { logout(); },
        headerConfig: {
            navigationLinks: NAVIGATION_OPTIONS,
            navigationLinksCurrentPath: setActiveNavItem(currentPath),
        },
    };
    return layout;
};

export { getLayoutProps, setActiveNavItem };