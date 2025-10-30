import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import VersionFields from "./VersionFields";

test("VersionFields renders correctly", () => {
    render(<VersionFields />);

    expect(screen.getByText("Release date and time")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-day")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-month")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-year")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-hour")).toBeInTheDocument();
    expect(screen.getByTestId("release-date-minutes")).toBeInTheDocument();
    expect(screen.getByText("Quality designation")).toBeInTheDocument();
    expect(screen.getByTestId("quality-designation-radios-item-accredited-official-input")).toBeInTheDocument();
    expect(screen.getByTestId("quality-designation-radios-item-official-input")).toBeInTheDocument();
    expect(screen.getByTestId("quality-designation-radios-item-official-in-development-input")).toBeInTheDocument();
    expect(screen.getByTestId("quality-designation-radios-item-no-accreditation-input")).toBeInTheDocument();
    expect(screen.getByText("Usage notes (optional)")).toBeInTheDocument();
    expect(screen.getByTestId("usage-notes-input-0")).toBeInTheDocument();
    expect(screen.getByTestId("usage-notes-textarea-0")).toBeInTheDocument();
    expect(screen.getByText("Alerts (optionnal)")).toBeInTheDocument();
    expect(screen.getByTestId("alerts-textarea-0")).toBeInTheDocument();
    expect(screen.getByText("Dataset file")).toBeInTheDocument();
    expect(screen.getByTestId("dataset-upload-input")).toBeInTheDocument();
});

test("Quality designation handler works as expected", () => {
    render(<VersionFields />);

    const input = screen.getByTestId("quality-designation-value-input");
    expect(input.value).toBe("");
    fireEvent.click(screen.getByTestId("quality-designation-radios-item-official-input"));
    expect(input.value).toBe("official");
});
