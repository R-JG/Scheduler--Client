import { useState, useEffect } from 'react';
import { Event, EventFormData, Selection, TimeSelectMode } from '../typeUtils/types';
import { eventToDbFormat, newEventToDbFormat, dbFormatToEvent } from '../typeUtils/conversion';
import { generateCalendarDates, getRandomHSLColor } from '../helpers';
import { middleCalendarDateNum,millisecondsInADay } from '../constants';
import eventsService from '../services/eventsService';
import validation from '../typeUtils/validation';
import CalendarContainer from './CalendarContainer';
import EventCreationPanel from './EventCreationPanel';
import DayPanelContainer from './DayPanelContainer';
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
    const [eventsOnCalendar, setEventsOnCalendar] = useState<Event[]>([]);
    const [eventFormData, setEventFormData] = useState<EventFormData>(
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
                    dbFormatToEvent(dbEvent)
                );
                setEvents(eventsArray);
            };
        });
    }, []);

    useEffect(() => {
        const eventsWithinCalendarRange = events.filter(event => 
            !((event.end.valueOf() <= calendarDates[0].valueOf()) 
            || (event.start.valueOf() >= 
            (calendarDates[calendarDates.length - 1].valueOf() + millisecondsInADay)))
        );
        setEventsOnCalendar(eventsWithinCalendarRange);
    }, [calendarDates, events]);


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

    const updateEventFormProperty = (name: string, value: string | Date): void => {
        setEventFormData({
            ...eventFormData,
            [name]: value
        });
    };

    const updateEventFormTimes = (date: Date): void => {
        if (timeSelectMode.start) {
            if ((eventFormData.end !== undefined) 
            && (date.valueOf() > eventFormData.end.valueOf())) return;
            updateEventFormProperty('start', date);
        } else if (timeSelectMode.end) {
            if ((eventFormData.start !== undefined)
            && (date.valueOf() < eventFormData.start.valueOf())) return;
            updateEventFormProperty('end', date);
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
        const dbEvent = newEventToDbFormat(newEvent);
        const responseData = eventsService.addEvent(dbEvent);
        responseData.then(addedDbEvent => {
            if (addedDbEvent) {
                const addedEvent = dbFormatToEvent(addedDbEvent);
                setEvents(events.concat(addedEvent));
            } else return console.log('added event is undefined');
        });
    };

    const stageEventEdit = (eventToEdit: Event): void => {
        if (createEventMode) return;
        setEventFormData({ ...eventToEdit });
        setEditEventMode(true);
    };

    const editEvent = () => {
        if (!eventFormData.eventId) return;
        const editedEvent = validation.parseEvent({ ...eventFormData });
        const dbEvent = eventToDbFormat(editedEvent);
        const responseData = eventsService.editEvent(dbEvent);
        responseData.then(updatedDbEvent => {
            if (updatedDbEvent) {
                const updatedEvent = dbFormatToEvent(updatedDbEvent);
                setEvents(events.map(event => 
                    (event.eventId === updatedEvent.eventId) ? updatedEvent : event
                ));
            } else return console.log('updated event is undefined');
        });
    };

    const endEventEdit = (): void => {
        clearEventFormData();
        setTimeSelectMode({ start: false, end: false });
        setEditEventMode(false);
    };

    const deleteEvent = (eventId: string): void => {
        const responseData = eventsService.deleteEvent(eventId);
        responseData.then(deletedDbEvent => {
            if (deletedDbEvent) {
                setEvents(events.filter(
                    event => (event.eventId !== deletedDbEvent.eventId)
                ));
            } else return console.log('deleted event is undefined');
        });
    };

    return (
        <main className='App'>
            <CalendarContainer 
                currentDate={currentDate}
                calendarDates={calendarDates} 
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                selection={selection}
                events={events}
                eventsOnCalendar={eventsOnCalendar}
                eventFormData={eventFormData}
                editEventMode={editEventMode}
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
                updateEventFormProperty={updateEventFormProperty}
                addNewEvent={addNewEvent}
                clearEventFormData={clearEventFormData}
            />
            <DayPanelContainer 
                currentDate={currentDate}
                calendarDates={calendarDates}
                calendarMonth={calendarMonth}
                eventsOnCalendar={eventsOnCalendar}
                selection={selection}
                eventFormData={eventFormData}
                editEventMode={editEventMode}
                createEventMode={createEventMode}
                timeSelectMode={timeSelectMode}
                setSelection={setSelection}
                setTimeSelectMode={setTimeSelectMode}
                updateEventFormProperty={updateEventFormProperty}
                updateEventFormTimes={updateEventFormTimes}
                stageEventEdit={stageEventEdit}
                editEvent={editEvent}
                endEventEdit={endEventEdit}
                deleteEvent={deleteEvent}
            />
        </main>
    );
};

export default App;