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

    const getBaseEventObjects = (): DayPanelEventObject[] => 
        props.eventsOnCalendar.reduce<DayPanelEventObject[]>((eventObjects, event) => {
            const eventRowCoordinates: RowCoordinates = props.getGridRowCoordinates(
                event.start, event.end
            );
            const eventColumnCoordinates: ColumnCoordinates = getGridColumnCoordinates(
                eventObjects, eventRowCoordinates, false
            );
            const newEventObject: DayPanelEventObject = { 
                event, 
                ...eventRowCoordinates, 
                ...eventColumnCoordinates 
            };
            return eventObjects.concat(newEventObject);
    }, []);

    const getEventObjects = (): DayPanelEventObject[] => {
        const baseEventObjects: DayPanelEventObject[] = getBaseEventObjects();
        if (!((props.selection.type === 'event') 
        || (props.editEventMode && props.eventFormData.eventId))) {
            return baseEventObjects;
        };
        const updatedEventObjectCoordinates: DayPanelEventObject[] = [...baseEventObjects]
            .sort((a, b) => (a.columnStart > b.columnStart) ? 1 : -1)
            .reduce<DayPanelEventObject[]>((eventObjects, baseEventObj) => {
                const isExpanded: boolean = (
                    ((props.selection.type === 'event') 
                    && (props.selection.value.eventId === baseEventObj.event.eventId)
                    || (props.editEventMode 
                    && (props.eventFormData.eventId === baseEventObj.event.eventId)))
                );
                const rowCoordinates: RowCoordinates = { 
                    rowStart: baseEventObj.rowStart,
                    rowEnd: baseEventObj.rowEnd
                };
                const newColumnCoordinates: ColumnCoordinates = getGridColumnCoordinates(
                    eventObjects, rowCoordinates, isExpanded
                );
                const newEventObj: DayPanelEventObject = {
                    ...baseEventObj,
                    columnStart: newColumnCoordinates.columnStart,
                    columnEnd: newColumnCoordinates.columnEnd
                };
                return eventObjects.concat(newEventObj);
            }, []);
            const reorderedEventObjects = props.eventsOnCalendar.map((eventObject, index) => {
                const newCoordinates: DayPanelEventObject | undefined = updatedEventObjectCoordinates
                    .find(eventCoordinates => 
                        (eventCoordinates.event.eventId === eventObject.eventId)
                );
                return newCoordinates ? newCoordinates : baseEventObjects[index];
            });
        return reorderedEventObjects;
    };

    const eventObjects = getEventObjects();


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