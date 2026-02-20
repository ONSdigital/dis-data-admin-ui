import "@testing-library/jest-dom"
import { render, screen, fireEvent } from "@testing-library/react"
import MigrationForm from "./MigrationForm"

jest.mock("next/navigation", () => ({ 
    useRouter: jest.fn().mockReturnValue({ 
        push: jest.fn(), 
    }), 
}));

describe("Migration Form", () => {

    const mockAction = jest.fn()
    test("Migration form renders correctly", () => {
        render(<MigrationForm action={mockAction} />);

        expect(screen.getByTestId("source-uri")).toBeInTheDocument();
        expect(screen.getByTestId("dataset-series-id")).toBeInTheDocument();
        expect(screen.getByTestId("create-migration-job-save")).toBeInTheDocument();
        expect(screen.getByTestId("create-migration-job-cancel")).toBeInTheDocument();
    });

    it("onChange handler updates text input state", () => {
        render(<MigrationForm action={mockAction} />);

        const sourceURI = screen.getByTestId("source-uri");
        fireEvent.change(sourceURI, { target: { value: "/test" } });
        expect(sourceURI.value).toBe("/test");

        const id = screen.getByTestId("dataset-series-id");
        fireEvent.change(id, { target: { value: "test id" } });
        expect(id.value).toBe("test id");
    });
});
