import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SuccessPanel from "./SuccessPanel";

describe("SuccessPanel", () => {
    test("renders nothing when no query param is passed in", () => {
        render(<SuccessPanel query={{}} contentType={"Test contentType"} />);

        expect(screen.queryByTestId("success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test contentType")).not.toBeInTheDocument();
    });

    test("renders nothing when no matching query param is passed in", () => {
        render(<SuccessPanel query={{test_param: "true" }} contentType={"Test contentType"} />);

        expect(screen.queryByTestId("success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test contentType")).not.toBeInTheDocument();
    });

    test("renders nothing when matching query param is false", () => {
        render(<SuccessPanel query={{display_success: "false" }} contentType={"Test contentType"} />);

        expect(screen.queryByTestId("success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test contentType")).not.toBeInTheDocument();
    });

    test("renders success panel when display_success query param is true", () => {
        render(<SuccessPanel query={{display_success: "true" }} contentType={"Test contentType"} />);

        expect(screen.getByTestId("success-panel")).toBeInTheDocument();
        expect(screen.getByText("Test contentType saved.")).toBeInTheDocument();
    });

    test("renders success panel when display_publish_success query param is true", () => {
        render(<SuccessPanel query={{display_publish_success: "true" }} contentType={"Foobar contentType"} />);

        expect(screen.getByTestId("success-panel")).toBeInTheDocument();
        expect(screen.getByText("Foobar contentType published.")).toBeInTheDocument();
    });
});
