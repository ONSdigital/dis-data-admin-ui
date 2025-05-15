import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import DateTimePicker from './DateTimePicker';

const renderDateTimePicker = (releaseDate) => {
    render(<DateTimePicker id="release-date" dataTestId="release-date" legend="Test date and time" description="" releaseDate={releaseDate}/>);
}

describe("DateTimerPicker", () => {
    it("renders correctly", () => {
        renderDateTimePicker();
        const day = screen.getByTestId("release-date-day");
        expect(day).toBeInTheDocument();

        const month = screen.getByTestId("release-date-month");
        expect(month).toBeInTheDocument();

        const year = screen.getByTestId("release-date-year");
        expect(year).toBeInTheDocument();

        const hour = screen.getByTestId("release-date-hour");
        expect(hour).toBeInTheDocument();

        const minutes = screen.getByTestId("release-date-minutes");
        expect(minutes).toBeInTheDocument();
    });

    it("renders correctly when existing date is passed in", () => {
        renderDateTimePicker("2025-02-25T09:30:00.000Z");
        const day = screen.getByTestId("release-date-day");
        expect(day.value).toBe("25");

        const month = screen.getByTestId("release-date-month");
        expect(month).toBeInTheDocument("2");

        const year = screen.getByTestId("release-date-year");
        expect(year).toBeInTheDocument("2025");

        const hour = screen.getByTestId("release-date-hour");
        expect(hour).toBeInTheDocument("9");

        const minutes = screen.getByTestId("release-date-minutes");
        expect(minutes).toBeInTheDocument("30");
    });

    it("onChange handler updates day state", () => {
        renderDateTimePicker();
        const day = screen.getByTestId("release-date-day");
        fireEvent.change(day, {target: {value: "1"}});
        expect(day.value).toBe("1");
    });

    it("onChange handler updates month state", () => {
        renderDateTimePicker();
        const month = screen.getByTestId("release-date-month");
        fireEvent.change(month, {target: {value: "1"}});
        expect(month.value).toBe("1");
    });

    it("onChange handler updates year state", () => {
        renderDateTimePicker();
        const year = screen.getByTestId("release-date-year");
        fireEvent.change(year, {target: {value: "2020"}});
        expect(year.value).toBe("2020");
    });

    it("onChange handler updates hour state", () => {
        renderDateTimePicker();
        const hour = screen.getByTestId("release-date-hour");
        fireEvent.change(hour, {target: {value: "09"}});
        expect(hour.value).toBe("09");
    });

    it("onChange handler updates minutes state", () => {
        renderDateTimePicker();
        const minutes = screen.getByTestId("release-date-minutes");
        fireEvent.change(minutes, {target: {value: "30"}});
        expect(minutes.value).toBe("30");
    });
});