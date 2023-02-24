import { Selection } from '../typeUtils/types';
import '../css/CalendarDate.css';

interface Props {
    date: Date,
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

    const isSelectedDateClass = (): 'selected-date' | '' => {
        if (props.selection.type !== 'date') return '';
        return (props.date.toDateString() === props.selection.value.toDateString())
            ? 'selected-date' 
            : '';
    };

    return (
        <div className={
            `CalendarDate 
            ${isSelectedDateClass()}`}
            onMouseDown={handleMouseDown}
        >
            {props.date.getDate()}
        </div>
    );
};

export default CalendarDate;