import { formatDate, ISOToDMYMHValues } from './datetime';

describe('formatDate', () => {
    test('should format a valid date string correctly', () => {
        const result = formatDate('2000-01-01T07:00:00.000Z');
        expect(result).toBe('1 January 2000');
    });

    test('should return "missing date" for null', () => {
        const result = formatDate(null);
        expect(result).toBe('missing date');
    });

    test('should return "missing date" for undefined', () => {
        const result = formatDate(undefined);
        expect(result).toBe('missing date');
    });

    test('should return "missing date" for an empty string', () => {
        const result = formatDate("");
        expect(result).toBe('missing date');
    });

    test('should return "missing date" for the default value "0001-01-01T00:00:00Z"', () => {
        const result = formatDate('0001-01-01T00:00:00Z');
        expect(result).toBe('missing date');
    });

    test('should return "missing date" for an invalid date string', () => {
        const result = formatDate('invalid-date');
        expect(result).toBe('missing date');
    });
});

describe('ISOToDMYMHValues', () => {
    test('should return correct values for valid date string', () => {
        const result = ISOToDMYMHValues('2000-01-01T07:00:00.000Z');
        expect(result.day).toBe(1);
        expect(result.month).toBe(1);
        expect(result.year).toBe(2000);
        expect(result.minutes).toBe('00');
        expect(result.hour).toBe(7);
    });

    test('should return null when called with no arguments', () => {
        const result = ISOToDMYMHValues();
        expect(result).toBeNull();
    });

    test('should return null when called with non date string', () => {
        const result = ISOToDMYMHValues('foobar');
        expect(result).toBeNull();
    });
});