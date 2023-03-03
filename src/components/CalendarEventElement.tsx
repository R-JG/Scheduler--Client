interface EventStyle {
    gridColumn: string,
    gridRow: string,
    backgroundColor: string
};

interface Props {
    style: EventStyle
};

const CalendarEventElement = (props: Props) => {

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
        <div 
            className='CalendarEventElement' 
            style={props.style}>
        </div>
    );
};

export default CalendarEventElement;