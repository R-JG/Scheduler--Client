import { Props } from '../typeUtils/types';
import { middleCalendarDateNum } from '../constants';


const CalendarHeader = (
    props: Pick<Props, 
    'calendarDates' |
    'calendarYear' |
    'calendarMonth' | 
    'changeMonth' >
) => {
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    const monthName = monthNames[props.calendarMonth];

    return (
        <div className='CalendarHeader'>
            <button 
                className='button--previous-month'
                onClick={() => props.changeMonth('previous')}
            >←</button>
            <h1 className='header-title--month'>{monthName}</h1>
            <h1 className='header-title--year'>{props.calendarYear}</h1>
            <button 
                className='button--next-month'
                onClick={() => props.changeMonth('next')}
            >→</button>
            <div className='header-day-names'>
                {dayNames.map((dayName, index) => (
                    <span 
                        key={index + dayName} 
                        className='day-name'>
                        {dayName}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CalendarHeader;