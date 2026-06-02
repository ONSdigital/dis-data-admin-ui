jest.mock("next/navigation", () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
    })),
    usePathname: jest.fn(() => "/"),
    useSearchParams: jest.fn(() => new URLSearchParams()),
}));
