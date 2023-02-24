import CalendarHeader from './CalendarHeader';
import CalendarDate from './CalendarDate';
import '../css/CalendarContainer.css';

interface Props {
    calendarDates: Date[], 
    calendarYear: number,
    calendarMonth: number,
    changeMonth: (direction: 'next' | 'previous') => void
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
                    />
                )}
            </div>
        </div>
    );
};

export default CalendarContainer;