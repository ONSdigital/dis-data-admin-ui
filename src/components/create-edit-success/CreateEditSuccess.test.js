import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateEditSuccess from "./CreateEditSuccess";

describe("CreateEditSuccess", () => {
    test("renders nothing when no  query param is passed in", () => {
        render(<CreateEditSuccess query={{}} message={"Test message"} />);

        expect(screen.queryByTestId("create-edit-success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    test("renders nothing when no matching query param is passed in", () => {
        render(<CreateEditSuccess query={{test_param: "true" }} message={"Test message"} />);

        expect(screen.queryByTestId("create-edit-success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    test("renders nothing when matching query param is false", () => {
        render(<CreateEditSuccess query={{display_success: "false" }} message={"Test message"} />);

        expect(screen.queryByTestId("create-edit-success-panel")).not.toBeInTheDocument();
        expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    test("renders success panel when matching query param is true", () => {
        render(<CreateEditSuccess query={{display_success: "true" }} message={"Test message"} />);

        expect(screen.getByTestId("create-edit-success-panel")).toBeInTheDocument();
        expect(screen.getByText("Test message")).toBeInTheDocument();
    });
});
