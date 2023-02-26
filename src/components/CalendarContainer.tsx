import { EventFormData, Selection, TimeSelectMode } from '../typeUtils/types';
import CalendarHeader from './CalendarHeader';
import CalendarDate from './CalendarDate';
import '../css/CalendarContainer.css';

interface Props {
    currentDate: Date,
    calendarDates: Date[], 
    calendarYear: number,
    calendarMonth: number,
    selection: Selection,
    eventFormData: EventFormData,
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
        </div>
    );
};

export default CalendarContainer;