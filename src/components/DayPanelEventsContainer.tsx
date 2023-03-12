import { 
    Event, EventFormData, Selection, DayPanelEventObject, RowCoordinates, ColumnCoordinates, TimeSelectMode 
} from '../typeUtils/types';
import { expandedEventColumnWidth } from '../constants';
import DayPanelEvent from './DayPanelEvent';
import '../css/DayPanelEventsContainer.css';

interface Props {
    eventsOnCalendar: Event[],
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    createEventMode: boolean,
    timeSelectMode: TimeSelectMode,
    setSelection: (selection: Selection) => void,
    setTimeSelectMode: (params: TimeSelectMode) => void,
    updateEventFormProperty: (name: string, value: string | Date) => void,
    stageEventEdit: (eventToEdit: Event) => void,
    editEvent: () => void,
    endEventEdit: () => void,
    deleteEvent: (eventId: string) => void,
    getGridRowCoordinates: (startDate: Date, endDate: Date) => RowCoordinates
};

const DayPanelEventsContainer = (props: Props) => {

    const getGridColumnCoordinates = (
            prevEventObjects: DayPanelEventObject[], 
            newRowCoordinates: RowCoordinates, 
            isExpanded: boolean
        ): ColumnCoordinates => {
            const columnWidth: number = (isExpanded) ? expandedEventColumnWidth : 1;
            const columnStart: number = prevEventObjects.reduce((columnCount, prevEventObj) => {
                const possibleStart: number = columnCount;
                const possibleEnd: number = possibleStart + columnWidth;
                return (((newRowCoordinates.rowEnd > prevEventObj.rowStart) 
                && (newRowCoordinates.rowStart < prevEventObj.rowEnd))
                && ((possibleEnd > prevEventObj.columnStart) 
                && (possibleStart < prevEventObj.columnEnd))) 
                    ? columnCount + (prevEventObj.columnEnd - prevEventObj.columnStart) 
                    : columnCount;
            }, 1);
            const columnEnd: number = columnStart + columnWidth;
            return { columnStart, columnEnd };
    };

    const initialValue: DayPanelEventObject[] = [];
    const eventObjects: DayPanelEventObject[] = props.eventsOnCalendar.reduce(
        (eventObjects, event) => {
            const eventRowCoordinates: RowCoordinates = props.getGridRowCoordinates(
                event.start, event.end
            );
            const isExpanded: boolean = (
                ((props.selection.type === 'event') 
                && (props.selection.value.eventId === event.eventId)
                || (props.editEventMode && (props.eventFormData.eventId === event.eventId)))
            );
            const eventColumnCoordinates: ColumnCoordinates = getGridColumnCoordinates(
                eventObjects, eventRowCoordinates, isExpanded
            );
            const newEventObject: DayPanelEventObject = { 
                event, 
                ...eventRowCoordinates, 
                ...eventColumnCoordinates 
            };
            return eventObjects.concat(newEventObject);
    }, initialValue);

    return (
        <div className='DayPanelEventsContainer'>
            {eventObjects.map(eventObj => 
                <DayPanelEvent 
                    event={eventObj.event}
                    style={{ 
                        gridColumn: `${eventObj.columnStart} / ${eventObj.columnEnd}`, 
                        gridRow: `${eventObj.rowStart} / ${eventObj.rowEnd}`, 
                        backgroundColor: eventObj.event.color 
                    }}
                    selection={props.selection}
                    eventFormData={props.eventFormData}
                    editEventMode={props.editEventMode}
                    createEventMode={props.createEventMode}
                    timeSelectMode={props.timeSelectMode}
                    setSelection={props.setSelection}
                    setTimeSelectMode={props.setTimeSelectMode}
                    updateEventFormProperty={props.updateEventFormProperty}
                    stageEventEdit={props.stageEventEdit}
                    editEvent={props.editEvent}
                    endEventEdit={props.endEventEdit}
                    deleteEvent={props.deleteEvent}
                />
            )}
        </div>
    );
};

export default DayPanelEventsContainer;