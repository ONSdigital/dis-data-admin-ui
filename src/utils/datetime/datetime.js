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