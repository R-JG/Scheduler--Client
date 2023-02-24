import { useState, useEffect } from 'react';
import { middleCalendarDateNum, totalCalendarDatesNum } from '../constants';
import CalendarContainer from './CalendarContainer';


const App = () => {

    const [currentDate] = useState(new Date()); 
    const [calendarDates, setCalendarDates] = useState([currentDate]);
    const [calendarYear, setCalendarYear] = useState(
        calendarDates[middleCalendarDateNum].getFullYear()
    );
    const [calendarMonth, setCalendarMonth] = useState(
        calendarDates[middleCalendarDateNum].getMonth()
    );

    useEffect(() => {
        setCalendarDates(generateCalendarDates(
            currentDate.getFullYear(), currentDate.getMonth()
        ));
    }, []);

    const generateCalendarDates = (year: number, month: number): Date[] => {
        const dayMonthBegins = new Date(year, month, 1).getDay();
        return Array.from(
            { length: totalCalendarDatesNum }, 
            (_, i) => new Date(year, month, (i - dayMonthBegins + 1)));
    };

    function changeMonth(direction: 'next' | 'previous'): void {
        switch (direction) {
            case 'next':
                setCalendarDates(
                    generateCalendarDates(calendarYear, calendarMonth + 1)
                );
                break;
            case 'previous': 
                setCalendarDates(
                    generateCalendarDates(calendarYear, calendarMonth - 1)
                );
                break;
            default: return;
        };
    };

    return (
        <div className='App'>
            <CalendarContainer 
                calendarDates={calendarDates} 
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                changeMonth={changeMonth} 
            />
        </div>
    );
};

export default App;