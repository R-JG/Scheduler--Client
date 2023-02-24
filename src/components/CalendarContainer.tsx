import { Props } from '../typeUtils/types';
import CalendarHeader from './CalendarHeader';

const CalendarContainer = (
    props: Pick<Props, 
    'calendarDates' | 
    'calendarYear' |
    'calendarMonth' |
    'changeMonth' >
) => {

    return (
        <div className='CalendarContainer'>
            <CalendarHeader 
                calendarDates={props.calendarDates} 
                calendarYear={props.calendarYear}
                calendarMonth={props.calendarMonth}
                changeMonth={props.changeMonth}
            />
        </div>
    );
};

export default CalendarContainer;