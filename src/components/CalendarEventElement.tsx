import { EventFormData, Selection, CalendarEvent, EventStyle } from '../typeUtils/types';
import '../css/CalendarEventElement.css';

interface Props {
    eventObject: CalendarEvent,
    style: EventStyle,
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    setSelection: (selection: Selection) => void
};

const CalendarEventElement = (props: Props) => {

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
            className={`CalendarEventElement ${hasSelectedEventClass()}`} 
            style={props.style}
            onClick={handleEventClick}
        >
            {props.eventObject.isFirstRow && 
            <div className='calendar-event-title'>
                {props.eventObject.event.title}
            </div>}
        </div>
    );
};

export default CalendarEventElement;