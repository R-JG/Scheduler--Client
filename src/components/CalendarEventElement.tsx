import { Event, EventFormData, Selection } from '../typeUtils/types';
import '../css/CalendarEventElement.css';

interface EventObject {
    event: Event,
    columnStart: number,
    columnEnd: number,
    rowStart: number,
    isFirstRow: boolean
};

interface EventStyle {
    gridColumn: string,
    gridRow: string,
    backgroundColor: string
};

interface Props {
    eventObject: EventObject,
    style: EventStyle,
    eventFormData: EventFormData,
    editEventMode: boolean,
    setSelection: (selection: Selection) => void
};

const CalendarEventElement = (props: Props) => {

    /*
    const handleEventClick = (): void => {
        if (props.editEventMode 
        && (props.eventFormData.id !== props.eventObject.event.id)) return;
        props.setSelection(
            { source: 'Calendar', type: 'event', value: props.eventObject.event }
        );
    };

    const hasSelectedEventClass = (event) => {
        if (selection.type !== 'event') return;
        return (selection.value.id === event.id)
            ? 'selected-event' 
            : '';
    };
    */

    return (
        <div 
            className='CalendarEventElement' 
            style={props.style}>
            {props.eventObject.isFirstRow && 
            <div className='calendar-event-title'>
                {props.eventObject.event.title}
            </div>}
        </div>
    );
};

export default CalendarEventElement;