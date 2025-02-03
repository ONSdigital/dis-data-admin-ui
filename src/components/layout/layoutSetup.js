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

export default function getLayoutProps() {
    const layout = {
        text: HEADER_TITLE,
        me: {
            displayName: 'User 01',
        },
        signOut: () => { logout(); },
        headerConfig: {
            navigationLinks: NAVIGATION_OPTIONS,
        },
    };
    return layout;
}