import { Event, Selection, EventFormData } from '../typeUtils/types';
import CalendarEventElement from './CalendarEventElement';
import '../css/CalendarEventsRow.css';

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
    eventRowObjects: EventObject[],
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    setSelection: (selection: Selection) => void
};

const CalendarEventsRow = (props: Props) => {

    const getGridRowNumber = (
            eventObj: EventObject, eventObjIndex: number
        ): number => props.eventRowObjects.reduce(
        (overlapCount, reduceEventObj, reduceIndex) => 
            ((reduceIndex < eventObjIndex) 
            && (reduceEventObj.columnStart < eventObj.columnEnd) 
            && (reduceEventObj.columnEnd > eventObj.columnStart)) 
                ? (overlapCount + 1) : overlapCount
    , 1);

    const createEventStyleObject = (
            eventRowObject: EventObject, gridRowBase: number
        ): EventStyle => ({
        gridColumn: `${eventRowObject.columnStart} / ${eventRowObject.columnEnd}`,
        gridRow: `${gridRowBase} / ${gridRowBase + 1}`,
        backgroundColor: eventRowObject.event.color
    });

    return (
        <div className='CalendarEventsRow'>
            {props.eventRowObjects.map((eventObject, index) => 
                <CalendarEventElement 
                    eventObject={eventObject}
                    style={createEventStyleObject(
                        eventObject, getGridRowNumber(eventObject, index)
                    )}
                    selection={props.selection}
                    eventFormData={props.eventFormData}
                    editEventMode={props.editEventMode}
                    setSelection={props.setSelection}
                />
            )}
        </div>
    );
};

export default CalendarEventsRow;