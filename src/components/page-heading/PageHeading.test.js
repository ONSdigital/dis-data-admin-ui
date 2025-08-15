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

describe("PageHeading", () => {
    test("PageHeading renders props correctly", () => {
        const pageHeadingProps =  {
            heading: "heading test",
            title: "title test",
            linkCreate: "/create",
            createMessage: "create message test",
            linkBack: "/back",
            backToMessage: "back to message test"
        }

        render(<PageHeading 
            heading={pageHeadingProps.heading} 
            title={pageHeadingProps.title}
            linkCreate={pageHeadingProps.linkCreate}
            createMessage={pageHeadingProps.createMessage} 
            linkBack={pageHeadingProps.linkBack} 
            backToMessage={pageHeadingProps.backToMessage}
        />);

        expect(screen.getByText("heading test")).toBeInTheDocument();
        expect(screen.getByText("title test")).toBeInTheDocument();
        expect(screen.getByText("create message test")).toBeInTheDocument();
        expect(screen.getByText("back to message test")).toBeInTheDocument();
    })

    it("onClick handlers gets called", () => {     
        const pageHeadingProps =  {
            heading: "heading test",
            title: "title test",
            linkCreate: "/create",
            createMessage: "create message test",
            linkBack: "/back",
            backToMessage: "back to message test"
        }

        render(<PageHeading 
            heading={pageHeadingProps.heading} 
            title={pageHeadingProps.title}
            linkCreate={pageHeadingProps.linkCreate}
            createMessage={pageHeadingProps.createMessage} 
            linkBack={pageHeadingProps.linkBack} 
            backToMessage={pageHeadingProps.backToMessage}
        />);

        const button = screen.getByTestId("page-heading-create-button");

        fireEvent.click(button)
        expect(useRouter().push.mock.calls).toHaveLength(1);
        expect(useRouter().push.mock.calls[0][0]).toBe("/create")
    });
});

