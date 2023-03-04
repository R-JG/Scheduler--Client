import { useRef, useEffect } from 'react';
import { Event, Selection } from '../typeUtils/types';
import DayPanelHourBlock from './DayPanelHourBlock';
import '../css/DayPanel.css';

interface Props {
    currentDate: Date,
    calendarDates: Date[],
    eventsOnCalendar: Event[],
    selection: Selection,
    editEventMode: boolean
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
    
    return (
        <div 
            className='DayPanel'
            ref={dayPanelRef}
        >
            <div className='hour-blocks-container'>
                {props.calendarDates.map(date => 
                    <DayPanelHourBlock 
                        key={date.toDateString()}
                        date={date}
                    />
                )}
            </div>
        </div>
    );
};

export default DayPanel;