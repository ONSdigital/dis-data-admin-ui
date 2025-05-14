import { logError } from "../log/log";

export function formatDate(dateString) {
    try {
        if (!dateString || dateString === "0001-01-01T00:00:00Z") {
            return "missing date";
        }
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    } catch (error) {
        logError("error formatting date", null, null, error);
        return "missing date";
    }
}

/**
 * Convert ISO date to day, month, year, minutes, hours values 
 * @param {string} dateString - ISO date string
 * @return {object} - day, month, year, minutes and hours values
 */
export function ISOToDMYMHValues(dateString) {
    if (!dateString) {
        return null;
    }
    try {
        const date = new Date(dateString);

        if (isNaN(date.getDate())) {
            const err = new Error("invalid date");
            logError("invalid date string received", null, null, err);
            return null;
        }

        let minutes = date.getMinutes();
        if (minutes < 9) { minutes = "0" + minutes; }

        return {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear(), minutes: minutes, hour: date.getHours()};
    } catch (error) {
        logError("error converting ISO date to day, month, year, minutes, hours values", null, null, error);
        return null;
    }
}