import { useRef, useEffect, MouseEvent } from 'react';
import { Event, Selection, TimeSelectMode } from '../typeUtils/types';
import { millisecondsInAnHour } from '../constants';
import DayPanelHourBlock from './DayPanelHourBlock';
import '../css/DayPanel.css';

interface Props {
    currentDate: Date,
    calendarDates: Date[],
    calendarMonth: number,
    eventsOnCalendar: Event[],
    selection: Selection,
    editEventMode: boolean,
    createEventMode: boolean,
    timeSelectMode: TimeSelectMode,
    setSelection: (selection: Selection) => void,
    updateEventFormTimes: (date: Date) => void
};

const DayPanel = (props: Props) => {

    const dayPanelRef = useRef<HTMLDivElement>(null);

    const getCalendarDateIndex = (date: Date): number => {
        return props.calendarDates.findIndex(calendarDate => 
            date.toDateString() === calendarDate.toDateString()
        );
    };

    useEffect(() => {
        scrollToDate(props.currentDate);
    }, []);

    useEffect(() => {
        if (((props.selection.type === 'date') 
        && (props.selection.source !== 'DayPanel')) 
        && (props.editEventMode === false)) {
            scrollToDate(props.selection.value);
        };
        if (props.selection.type === 'event') {
            scrollToEvent(props.selection.value);
        };
    }, [props.selection]);

    const scrollToDate = (date: Date): void =>  {
        const dateIndex = getCalendarDateIndex(date);
        if (!dayPanelRef.current) return;
        /* 
            In the old version, the first children selector is set to 2 instead of 0 
            because the events and form containers are placed before.
        */
        dayPanelRef.current.children[0].children[dateIndex].scrollIntoView(
            { behavior: 'smooth', block: 'start' }
        );
    };

    const scrollToEvent = (event: Event): void => {
        /* 
            ############# Disabled until events are added #############

        const eventIndex = props.eventsOnCalendar.findIndex(eventOnCalendar => (
            event.eventId === eventOnCalendar.eventId
        ));
        if (!dayPanelRef.current) return;
        dayPanelRef.current.children[0].children[eventIndex].scrollIntoView(
            { behavior: 'smooth', block: 'start' }
        );
        */
    };

    const createIdString = (date: Date, hourValue: number): string => {
        return `${date.valueOf()} ${hourValue}`;
    };

    // assumes that the id is a string consisting in a date in milliseconds, a space, and an hour number.
    const delegateHourClick = (e: MouseEvent<HTMLElement>): void => {
        if ((!(e.target instanceof HTMLElement)) 
        || (!(e.target.classList.contains('DayPanelHour')))) return;
        const idValues: string[] = e.target.id.split(' ');
        const hourValue: number = Number(idValues[idValues.length - 1]);
        const dateValue: number = Number(idValues[0]);
        const newDate: Date = new Date(dateValue + (hourValue * millisecondsInAnHour));
        if ((props.editEventMode || props.createEventMode)
        && (props.timeSelectMode.start || props.timeSelectMode.end)) {
            props.updateEventFormTimes(newDate);
        } else {
            props.setSelection({ source: 'DayPanel', type: 'date', value: newDate });
        };
    };


    /* add form selection marker - make it a function that sets a local state bool,
     and then define the element inside the container with a conditional based on state */

    return (
        <div 
            className='DayPanel'
            ref={dayPanelRef}
            onClick={delegateHourClick}
        >
            <div className='hour-blocks-container'>
                {props.calendarDates.map(date => 
                    <DayPanelHourBlock 
                        key={date.toDateString()}
                        date={date}
                        calendarMonth={props.calendarMonth}
                        createIdString={createIdString}
                    />
                )}
            </div>
        </div>
    );
};

export default DayPanel;