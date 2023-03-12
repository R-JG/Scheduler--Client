import { EventFormData, Selection, CalendarEventObject, EventStyle } from '../typeUtils/types';
import '../css/CalendarEvent.css';

interface Props {
    eventObject: CalendarEventObject,
    style: EventStyle,
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    setSelection: (selection: Selection) => void
};

const CalendarEvent = (props: Props) => {

    const handleEventClick = (): void => {
        if (props.editEventMode 
        && (props.eventFormData.eventId !== props.eventObject.event.eventId)) return;
        props.setSelection(
            { source: 'Calendar', type: 'event', value: props.eventObject.event }
        );
    };

    const hasSelectedEventClass = (): 'selected-event' | '' => {
        return ((props.selection.type === 'event') 
        && (props.selection.value.eventId === props.eventObject.event.eventId))
            ? 'selected-event' 
            : '';
    };
    
    return (
        <div 
            className={`CalendarEvent ${hasSelectedEventClass()}`} 
            style={props.style}
            onClick={handleEventClick}
        >
            {props.eventObject.isFirstRow && 
            <span className='calendar-event-title'>
                {props.eventObject.event.title}
            </span>}
        </div>
    );
};

export default CalendarEvent;