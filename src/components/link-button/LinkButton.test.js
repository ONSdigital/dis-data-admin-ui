import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import LinkButton from "./LinkButton";

import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));


describe("LinkButton", () => {
    test("LinkButton renders props correctly", () => {
        const buttonProps =  {
            text: "test",
            link: "/test",
            iconType: "DeleteIcon",
            iconPosition: "Before",
        }

        render(<LinkButton text={buttonProps.text} link={buttonProps.link} iconType={buttonProps.iconType} iconPosition={buttonProps.iconPosition}/>);

        const button = screen.getByTestId("link-button");
        expect(button).toHaveTextContent("test")
    })

    it("onClick handler gets called", () => {     
        const buttonProps =  {
            text: "test",
            link: "/test",
            iconType: "DeleteIcon",
            iconPosition: "Before",
        }

        render(<LinkButton text={buttonProps.text} link={buttonProps.link}/>);

        const button = screen.getByTestId("link-button");
        fireEvent.click(button)
        expect(useRouter().push.mock.calls).toHaveLength(1);
        expect(useRouter().push.mock.calls[0][0]).toBe("/test")    
    });
});

