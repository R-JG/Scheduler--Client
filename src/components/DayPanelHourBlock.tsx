import { createHourString } from '../helpers';
import '../css/DayPanelHourBlock.css';

interface Props {
    date: Date,
    calendarMonth: number,
    hoursPerBlock: number
};

const DayPanelHourBlock = (props: Props) => {

    const createHourIdString = (date: Date, hourValue: number): string => {
        return `${date.valueOf()} ${hourValue}`;
    };

    const hasAlternateMonthClass = (): 'alternate-month' | '' => {
        return (props.date.getMonth() !== props.calendarMonth)
        ? 'alternate-month'
        : '';
    };

    return (
        <div className={`DayPanelHourBlock ${hasAlternateMonthClass()}`}>
            <div className='date-separator'>
                {props.date.toDateString()}
            </div>
            {Array.from({ length: props.hoursPerBlock }, (_, index) => 
                <div 
                    key={index}
                    className='day-panel-hour' 
                    id={createHourIdString(props.date, index)}
                >
                    <div className='hour-text'>{createHourString(index)}</div>
                </div>
            )}
        </div>
    );
};

export default DayPanelHourBlock;