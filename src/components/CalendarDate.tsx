import { Selection } from '../typeUtils/types';
import '../css/CalendarDate.css';

interface Props {
    date: Date,
    currentDate: Date,
    calendarMonth: number,
    selection: Selection,
    updateSelection: (selectionObj: Selection) => void
};

const CalendarDate = (props: Props) => {

    const handleMouseDown = (): void => {
        const selectionObj: Selection = { 
            source: 'Calendar', 
            type: 'date', 
            value: props.date 
        };
        props.updateSelection(selectionObj);

        //updateEventFormTimesFromCalendar();
    };

    const hasSelectedDateClass = (): 'selected-date' | '' => {
        if (props.selection.type !== 'date') return '';
        return (props.date.toDateString() === props.selection.value.toDateString())
            ? 'selected-date' 
            : '';
    };

    const hasCurrentDateClass = (): 'current-date' | '' => {
        return (props.date.toDateString() === props.currentDate.toDateString()) 
        ? 'current-date'
        : '';
    };

    const hasAlternateMonthClass = (): 'alternate-month' | '' => {
        return (props.date.getMonth() !== props.calendarMonth)
        ? 'alternate-month'
        : '';
    };

    return (
        <div className={
                `CalendarDate 
                 ${hasSelectedDateClass()} 
                 ${hasCurrentDateClass()} 
                 ${hasAlternateMonthClass()}`}
            onMouseDown={handleMouseDown}
        >
            {props.date.getDate()}
        </div>
    );
};

export default CalendarDate;