import { useState, useEffect } from 'react';
import { Selection } from '../typeUtils/types';
import { middleCalendarDateNum, totalCalendarDatesNum } from '../constants';
import CalendarContainer from './CalendarContainer';
import '../css/App.css';


const generateCalendarDates = (year: number, month: number): Date[] => {
    const dayMonthBegins = new Date(year, month, 1).getDay();
    return Array.from(
        { length: totalCalendarDatesNum }, 
        (_, i) => new Date(year, month, (i - dayMonthBegins + 1)));
};


const App = () => {

    const [currentDate] = useState(new Date()); 
    const [calendarDates, setCalendarDates] = useState(
        generateCalendarDates(currentDate.getFullYear(), currentDate.getMonth())
    );
    const [calendarYear, setCalendarYear] = useState(
        calendarDates[middleCalendarDateNum].getFullYear()
    );
    const [calendarMonth, setCalendarMonth] = useState(
        calendarDates[middleCalendarDateNum].getMonth()
    );
    const [selection, setSelection] = useState<Selection>(
        { source: 'Calendar', type: 'date', value: currentDate }
    );

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

    const updateSelection = (selectionObj: Selection): void => {
        setSelection(selectionObj);
    };

    return (
        <main className='App'>
            <CalendarContainer 
                calendarDates={calendarDates} 
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                selection={selection}
                changeMonth={changeMonth} 
                updateSelection={updateSelection}
            />
        </main>
    );
};

export default App;