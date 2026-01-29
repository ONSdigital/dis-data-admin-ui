import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import PageHeading from "./PageHeading";

import { useRouter } from "next/navigation";
import { expect } from "@playwright/test";

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));

describe("PageHeading renders correctly", () => {
    let pageHeadingProps =  {
        title: "title test",
    }

    test("when only a title prop is passed in", () => {
        render(<PageHeading {...pageHeadingProps} />);

        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-subtitle")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-create-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-link")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-button")).not.toBeInTheDocument();
    });

    test("when only a title and subtitle prop is passed in", () => {
        pageHeadingProps.subtitle = "subtitle test";
        render(<PageHeading {...pageHeadingProps} />);

        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.getByText("subtitle test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-create-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-link")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-button")).not.toBeInTheDocument();
    });

    test("when a title, subtitle, button and link prop is passed in", () => {
        pageHeadingProps = {
            ...pageHeadingProps,
            buttonURL: "/button/url/test",
            buttonText: "button test",
            linkURL: "/link/url/test",
            linkText: "link test"
        };
        render(<PageHeading {...pageHeadingProps} />);

        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.getByText("subtitle test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-create-button")).toBeInTheDocument();
        expect(screen.getByText("button test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-link")).toBeInTheDocument();
        expect(screen.getByText("link test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-button")).not.toBeInTheDocument();
    });

    test("when a title, subtitle, button, link and panel prop is passed in", () => {
        pageHeadingProps = {
            ...pageHeadingProps,
            showPanel: true,
            panelText: "panel test"
        };
        render(<PageHeading {...pageHeadingProps} />);

        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.getByText("subtitle test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-create-button")).toBeInTheDocument();
        expect(screen.getByText("button test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-link")).toBeInTheDocument();
        expect(screen.getByText("link test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-panel")).toBeInTheDocument();
        expect(screen.getByText("panel test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-panel")).not.toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-button")).not.toBeInTheDocument();
    });

    test("when a title, subtitle, button, link, panel and show publish message prop is passed in", () => {
        pageHeadingProps = {
            ...pageHeadingProps,
            showPublishChangesMessage: true,
            publishLink: "/publish"
        };
        render(<PageHeading {...pageHeadingProps} />);

        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.getByText("subtitle test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-create-button")).toBeInTheDocument();
        expect(screen.getByText("button test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-link")).toBeInTheDocument();
        expect(screen.getByText("link test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-panel")).toBeInTheDocument();
        expect(screen.getByText("panel test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-button")).not.toBeInTheDocument();
    });

    test("when a title, subtitle, button, link, panel, show publish message and show publish button prop is passed in", () => {
        pageHeadingProps = {
            ...pageHeadingProps,
            showPublishChangesMessage: true,
            showPublishChangesButton: true,
            publishLink: "/publish"
        };
        render(<PageHeading {...pageHeadingProps} />);

        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.getByText("subtitle test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-create-button")).toBeInTheDocument();
        expect(screen.getByText("button test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-link")).toBeInTheDocument();
        expect(screen.getByText("link test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-panel")).toBeInTheDocument();
        expect(screen.getByText("panel test")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-panel")).toBeInTheDocument();
        expect(screen.queryByTestId("page-heading-publish-button")).toBeInTheDocument();
    });
});

describe("PageHeading", () => {
    it("onClick handlers gets called", () => {     
        const pageHeadingProps =  {
            title: 'title test',
            subtitle: 'subtitle test',
            buttonURL: '/button/url/test',
            buttonText: 'button test',
            linkURL: '/link/url/test',
            linkText: 'link test'
        }

        render(<PageHeading {...pageHeadingProps} />);

        const button = screen.getByTestId("page-heading-create-button");

        fireEvent.click(button)
        expect(useRouter().push.mock.calls).toHaveLength(1);
        expect(useRouter().push.mock.calls[0][0]).toBe("/button/url/test")
    });
});
