import { Event, Selection, EventFormData } from '../typeUtils/types';
import CalendarEventElement from './CalendarEventElement';

interface EventObject {
    event: Event,
    columnStart: number,
    columnEnd: number,
    rowStart: number,
    isFirstRow: boolean
};

interface Props {
    eventObjects: EventObject[],
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    setSelection: (selection: Selection) => void
};

const CalendarEventsRow = (props: Props) => {

    /*
    const handleEventRowClick = (event) => {
        if (editEventMode && (eventFormData.id !== event.id)) return;
        updateSelection('event', event);
    };

    const hasSelectedEventClass = (event) => {
        if (selection.type !== 'event') return;
        return (selection.value.id === event.id)
            ? 'selected-event' 
            : '';
    };
    */

    return (
        <div></div>
    );
};

export default CalendarEventsRow;