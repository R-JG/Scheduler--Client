import { Event, EventFormData, Selection, TimeSelectMode } from '../typeUtils/types';
import CalendarHeader from './CalendarHeader';
import CalendarDate from './CalendarDate';
import CalendarEventsContainer from './CalendarEventsContainer';
import '../css/CalendarContainer.css';

interface Props {
    currentDate: Date,
    calendarDates: Date[], 
    calendarYear: number,
    calendarMonth: number,
    selection: Selection,
    events: Event[],
    eventsOnCalendar: Event[],
    eventFormData: EventFormData,
    editEventMode: boolean,
    timeSelectMode: TimeSelectMode,
    changeMonth: (direction: 'next' | 'previous') => void,
    setSelection: (selection: Selection) => void,
    updateEventFormTimes: (date: Date) => void
};

const CalendarContainer = (props: Props) => {

    return (
        <div className='CalendarContainer'>
            <CalendarHeader 
                calendarDates={props.calendarDates} 
                calendarYear={props.calendarYear}
                calendarMonth={props.calendarMonth}
                changeMonth={props.changeMonth}
            />
            <div className='calendar-dates-container'>
                {props.calendarDates.map(date => 
                    <CalendarDate 
                        key={date.toDateString()} 
                        date={date}
                        currentDate={props.currentDate}
                        calendarMonth={props.calendarMonth}
                        eventFormData={props.eventFormData}
                        selection={props.selection}
                        timeSelectMode={props.timeSelectMode}
                        setSelection={props.setSelection}
                        updateEventFormTimes={props.updateEventFormTimes}
                    />
                )}
            </div>
            <CalendarEventsContainer 
                calendarDates={props.calendarDates}
                selection={props.selection}
                events={props.events}
                eventsOnCalendar={props.eventsOnCalendar}
                eventFormData={props.eventFormData}
                editEventMode={props.editEventMode}
                setSelection={props.setSelection}
            />
        </div>
    );
};

export default CalendarContainer;