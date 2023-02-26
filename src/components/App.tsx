import { useState, useEffect } from 'react';
import { EventFormData, Selection, TimeSelectMode } from '../typeUtils/types';
import { generateCalendarDates } from '../helpers';
import { middleCalendarDateNum } from '../constants';
import CalendarContainer from './CalendarContainer';
import EventCreationPanel from './EventCreationPanel';
import '../css/App.css';


const App = () => {

    const [currentDate] = useState(new Date()); 
    const [calendarDates, setCalendarDates] = useState(
        generateCalendarDates(currentDate.getFullYear(), currentDate.getMonth())
    );
    const [calendarYear, setCalendarYear] = useState(currentDate.getFullYear());
    const [calendarMonth, setCalendarMonth] = useState(currentDate.getMonth());
    const [selection, setSelection] = useState<Selection>(
        { source: 'Calendar', type: 'date', value: currentDate }
    );
    const [ eventFormData, setEventFormData ] = useState<EventFormData>(
        { start: undefined, end: undefined, title: '', description: '' }
    );
    const [createEventMode, setCreateEventMode] = useState(false);
    const [editEventMode, setEditEventMode] = useState(false);
    const [timeSelectMode, setTimeSelectMode] = useState<TimeSelectMode>(
        { start: false, end: false }
    );


    useEffect(() => {
        setCalendarYear(calendarDates[middleCalendarDateNum].getFullYear());
        setCalendarMonth(calendarDates[middleCalendarDateNum].getMonth());
    }, [calendarDates]);


    const changeMonth = (direction: 'next' | 'previous'): void => {
        switch (direction) {
            case 'next':
                setCalendarDates(
                    generateCalendarDates(calendarYear, (calendarMonth + 1))
                );
                break;
            case 'previous': 
                setCalendarDates(
                    generateCalendarDates(calendarYear, (calendarMonth - 1))
                );
                break;
            default: return;
        };
    };

    const updateEventFormValue = (name: string, value: string | Date): void => {
        setEventFormData({
            ...eventFormData,
            [name]: value
        });
    };

    const updateEventFormTimes = (date: Date): void => {
        if (timeSelectMode.start) {
            if ((eventFormData.end !== undefined) 
            && (date.valueOf() > eventFormData.end.valueOf())) return;
            updateEventFormValue('start', date);
        } else if (timeSelectMode.end) {
            if ((eventFormData.start !== undefined)
            && (date.valueOf() < eventFormData.start.valueOf())) return;
            updateEventFormValue('end', date);
        } else return; 
        if ((timeSelectMode.start) && (eventFormData.end === undefined)) {
            setTimeSelectMode({ start: false, end: true });
        };
    };

    const clearEventFormData = (): void => {
        setEventFormData(
            { start: undefined, end: undefined, title: '', description: '' }
        );
    };

    /*
    const addNewEvent = (): void => {
        const newEvent = {
            ...eventFormData,
            id: nanoid(),
            color: getRandomHSLColor()
        };
        setEvents((prevEvents) => [
            ...prevEvents,
            newEvent
        ]);
    };
    */

    console.log(createEventMode);
    console.log(eventFormData);
    console.log(timeSelectMode);
    
    

    return (
        <main className='App'>
            <CalendarContainer 
                currentDate={currentDate}
                calendarDates={calendarDates} 
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                eventFormData={eventFormData}
                selection={selection}
                timeSelectMode={timeSelectMode}
                changeMonth={changeMonth} 
                setSelection={setSelection}
                updateEventFormTimes={updateEventFormTimes}
            />
            <EventCreationPanel 
                eventFormData={eventFormData}
                createEventMode={createEventMode}
                editEventMode={editEventMode}
                timeSelectMode={timeSelectMode}
                setCreateEventMode={setCreateEventMode}
                setTimeSelectMode={setTimeSelectMode}
                updateEventFormValue={updateEventFormValue}
                clearEventFormData={clearEventFormData}
            />
        </main>
    );
};

export default App;