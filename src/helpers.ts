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

export const getRandomHSLColor = (): string => {
    const randomNumber = Math.floor(Math.random() * 361);
    return `hsl(${randomNumber}, 100%, 50%)`;
};

export const createHourString = (hour: number): string => {
    if (hour === 0) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
};