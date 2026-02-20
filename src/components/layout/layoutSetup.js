import { logout } from "@/utils/auth/auth";

const HEADER_TITLE = "Dataset Catalogue Manager";
const NAVIGATION_OPTIONS = [
    {
        text: "Home",
        url: "/data-admin"
    },
    {
        text: "Dataset catalogue",
        url: "/data-admin/series"
    },
    {
        text: "Migration",
        url: "/data-admin/migration"
    },
];

/**
 * Checks current path against list of navigation options
 * @param  {string} currentPath - path of current page
 * @return {string} - path from navigation options
 */
const setActiveNavItem = (currentPath) => {
    if (!currentPath) return null;
    let activeLink = null;
    NAVIGATION_OPTIONS.forEach(item => {
        const navOptionRoot = item.url.split("/data-admin")[1];
        if (currentPath.includes(navOptionRoot) && navOptionRoot.length) {
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
const getLayoutProps = (currentPath, username) => {
    const layout = {
        text: HEADER_TITLE,
        me: {
            displayName: username,
        },
        signOut: () => { logout(); },
        headerConfig: {
            navigationLinks: NAVIGATION_OPTIONS,
            navigationLinksCurrentPath: setActiveNavItem(currentPath),
        },
    };
    return layout;
};

export { getLayoutProps, setActiveNavItem, NAVIGATION_OPTIONS };