import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import VersionFields from "./VersionFields";

test("VersionFields renders correctly", () => {
    render(<VersionFields />);

    expect(screen.getByText("Dataset version details")).toBeInTheDocument();
    expect(screen.getByText("Release date and time")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-day")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-month")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-year")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-hour")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-minutes")).toBeInTheDocument();
    expect(screen.getByText("Quality designation")).toBeInTheDocument();
    expect(screen.getByTestId("select-quality-designation")).toBeInTheDocument();
    expect(screen.getByText("Usage notes")).toBeInTheDocument();
    expect(screen.getByTestId("usage-notes-input-0")).toBeInTheDocument();
    expect(screen.getByTestId("usage-notes-textarea-0")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByTestId("select-alerts-select-0")).toBeInTheDocument();
    expect(screen.getByTestId("alerts-textarea-0")).toBeInTheDocument();
    expect(screen.getByText("Dataset file")).toBeInTheDocument();
    expect(screen.getByTestId("dataset-upload-input")).toBeInTheDocument();
});

test("Quality designation handler works as expected", () => {
    render(<VersionFields />);

    const input = screen.getByTestId("quality-designation-value-input");
    expect(input.value).toBe("");
    fireEvent.change(screen.getByTestId("select-quality-designation"), { target: { value: "official" } });
    expect(input.value).toBe("official");
});
