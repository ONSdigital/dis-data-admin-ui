import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SuccessPanel from "./SuccessPanel";

describe("SuccessPanel", () => {
    test("renders nothing when no query param is passed in", () => {
        render(<SuccessPanel query={{}} message={"Test message"} />);

        expect(screen.queryByTestId("success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    test("renders nothing when no matching query param is passed in", () => {
        render(<SuccessPanel query={{test_param: "true" }} message={"Test message"} />);

        expect(screen.queryByTestId("success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    test("renders nothing when matching query param is false", () => {
        render(<SuccessPanel query={{display_success: "false" }} message={"Test message"} />);

        expect(screen.queryByTestId("success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    test("renders success panel when matching query param is true", () => {
        render(<SuccessPanel query={{display_success: "true" }} message={"Test message"} />);

        expect(screen.getByTestId("success-panel")).toBeInTheDocument();
        expect(screen.getByText("Test message")).toBeInTheDocument();
    });
});
