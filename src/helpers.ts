import { totalCalendarDatesNum } from './constants';


export const generateCalendarDates = (year: number, month: number): Date[] => {
    const dayMonthBegins = new Date(year, month, 1).getDay();
    return Array.from(
        { length: totalCalendarDatesNum }, 
        (_, i) => new Date(year, month, (i - dayMonthBegins + 1)));
};

export const generateTimeString = (dateObj: Date): string => {
    const timeString = dateObj.toLocaleTimeString();
    return (timeString.substring(0, (timeString.length - 6)) 
        + timeString.substring((timeString.length - 3), timeString.length));
};
