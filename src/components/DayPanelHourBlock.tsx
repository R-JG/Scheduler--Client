import { createHourString } from '../helpers';
import DayPanelHour from './DayPanelHour';
import '../css/DayPanelHourBlock.css';

interface Props {
    date: Date,
    calendarMonth: number,
    createIdString: (date: Date, hourValue: number) => string
};

const DayPanelHourBlock = (props: Props) => {

    const numberOfHours = 24;

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
            {Array.from({ length: numberOfHours }, (_, index) => 
                <DayPanelHour 
                    key={index}
                    id={props.createIdString(props.date, index)}
                    hour={createHourString(index)}
                />
            )}
        </div>
    );
};

export default DayPanelHourBlock;