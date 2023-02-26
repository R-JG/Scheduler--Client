import { MouseEvent } from 'react';
import { EventFormData, Selection, TimeSelectMode } from '../typeUtils/types';
import '../css/CalendarDate.css';

interface Props {
    date: Date,
    currentDate: Date,
    calendarMonth: number,
    eventFormData: EventFormData,
    selection: Selection,
    timeSelectMode: TimeSelectMode,
    setSelection: (selection: Selection) => void,
    updateEventFormTimes: (date: Date) => void
};

const CalendarDate = (props: Props) => {

    const handleFormTimeUpdate = (): void => {
        const nextDate = new Date(props.date);
        if (props.timeSelectMode.end) nextDate.setHours(23, 59, 59, 999);
        props.updateEventFormTimes(nextDate);
    };

    const handleMouseDown = (): void => {
        const selectionObj: Selection = { 
            source: 'Calendar', 
            type: 'date', 
            value: props.date 
        };
        props.setSelection(selectionObj);
        if (props.timeSelectMode.start || props.timeSelectMode.end) {
            handleFormTimeUpdate();
        };
    };

    const handleMouseOver = (e: MouseEvent<HTMLElement>) => {
        if (e.buttons) {
            if (props.timeSelectMode.start || props.timeSelectMode.end) {
                handleFormTimeUpdate();
            };
        };
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

    const hasFormDateSelectionClass = (): 'form-date-selection' | '' => {
        if (((props.eventFormData.start && 
            ((props.date.toDateString() === props.eventFormData.start.toDateString())))
            || (props.eventFormData.end && 
            ((props.date.toDateString() === props.eventFormData.end.toDateString()))))
        || ((props.eventFormData.start && props.eventFormData.end) &&
            (props.date.valueOf() >= props.eventFormData.start.valueOf())
            && (props.date.valueOf() <= props.eventFormData.end.valueOf()))) {
            return 'form-date-selection';
        } else return '';
    };

    return (
        <div className={
                `CalendarDate 
                 ${hasSelectedDateClass()} 
                 ${hasCurrentDateClass()} 
                 ${hasAlternateMonthClass()} 
                 ${hasFormDateSelectionClass()}`}
            onMouseDown={handleMouseDown}
            onMouseOver={handleMouseOver}
        >
            {props.date.getDate()}
        </div>
    );
};

export default CalendarDate;