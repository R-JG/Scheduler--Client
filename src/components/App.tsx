import { useState, useEffect } from 'react';
import { Event, NewEvent, EventFormData, Selection, TimeSelectMode } from '../typeUtils/types';
import { 
    generateCalendarDates, 
    getRandomHSLColor, 
    convertDbFormatToEvent, 
    convertNewEventToDbFormat 
} from '../helpers';
import { middleCalendarDateNum } from '../constants';
import eventsService from '../services/eventsService';
import validation from '../typeUtils/validation';
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
    const [events, setEvents] = useState<Event[]>([]);
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

    useEffect(() => {
        const response = eventsService.getAllEvents();
        response.then(dbEventsArray => {
            if (dbEventsArray) {
                const eventsArray = dbEventsArray.map(dbEvent => 
                    convertDbFormatToEvent(dbEvent)
                );
                setEvents(eventsArray);
            };
        });
    }, []);


    console.log(events);
    

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

    const addNewEvent = (): void => {
        const newEvent = validation.parseNewEvent({
            ...eventFormData,
            color: getRandomHSLColor()
        });
        const dbEvent = convertNewEventToDbFormat(newEvent);
        const response = eventsService.addEvent(dbEvent);
        response.then(addedDbEvent => {
            if (addedDbEvent) {
                const addedEvent = convertDbFormatToEvent(addedDbEvent);
                setEvents(events.concat(addedEvent));
            } else return console.log('added event is undefined');
        });
    };


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
                addNewEvent={addNewEvent}
                clearEventFormData={clearEventFormData}
            />
        </main>
    );
};

export default App;