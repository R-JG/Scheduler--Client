import { 
    Event, 
    EventFormData, 
    Selection, 
    DayPanelEvent, 
    RowCoordinates, 
    ColumnCoordinates 
} from '../typeUtils/types';
import { expandedEventColumnWidth } from '../constants';
import '../css/DayPanelEventsContainer.css';

interface Props {
    eventsOnCalendar: Event[],
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    getGridRowCoordinates: (startDate: Date, endDate: Date) => RowCoordinates
};

const DayPanelEventsContainer = (props: Props) => {

    const getGridColumnCoordinates = (
            prevEventObjects: DayPanelEvent[], 
            newRowCoordinates: RowCoordinates, 
            isSelected: boolean
        ): ColumnCoordinates => {
            const columnWidth: number = (isSelected) ? expandedEventColumnWidth : 1;
            const columnStart: number = prevEventObjects.reduce((columnCount, prevEventObj) => {
                const possibleStart: number = columnCount;
                const possibleEnd: number = possibleStart + columnWidth;
                return (((newRowCoordinates.rowEnd > prevEventObj.rowStart) 
                && (newRowCoordinates.rowStart < prevEventObj.rowEnd))
                && ((possibleEnd > prevEventObj.columnStart) 
                && (possibleStart < prevEventObj.columnEnd))) 
                    ? columnCount + 1 : columnCount
            }, 1);
            const columnEnd: number = columnStart + columnWidth;
            return { columnStart, columnEnd };
    };

    const initialValue: DayPanelEvent[] = [];
    const eventObjects: DayPanelEvent[] = props.eventsOnCalendar.reduce(
        (eventObjects, event) => {
            const eventRowCoordinates: RowCoordinates = props.getGridRowCoordinates(
                event.start, event.end
            );
            const isSelected: boolean = (
                ((props.selection.type === 'event') 
                && (props.selection.value.eventId === event.eventId)
                || (props.editEventMode && (props.eventFormData.eventId === event.eventId)))
            );
            const eventColumnCoordinates: ColumnCoordinates = getGridColumnCoordinates(
                eventObjects, eventRowCoordinates, isSelected
            );
            const newEventObject: DayPanelEvent = { 
                event, 
                ...eventRowCoordinates, 
                ...eventColumnCoordinates 
            };
            return eventObjects.concat(newEventObject);
    }, initialValue);


    return (
        <div className='DayPanelEventsContainer'></div>
    );
};

export default DayPanelEventsContainer;