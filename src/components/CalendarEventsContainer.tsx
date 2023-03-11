import { Event, Selection, EventFormData, DateGridItem, CalendarEventObject } from '../typeUtils/types';
import { calendarHeightNum, calendarWidthNum } from '../constants';
import CalendarEventsRow from './CalendarEventsRow';
import '../css/CalendarEventsContainer.css';

interface Props {
    calendarDates: Date[], 
    selection: Selection,
    events: Event[],
    eventsOnCalendar: Event[],
    eventFormData: EventFormData,
    editEventMode: boolean,
    setSelection: (selection: Selection) => void
};

const CalendarEventsContainer = (props: Props) => {

    const dateGridCoordinates: DateGridItem[] = props.calendarDates.map(
        (date, index) => ({
            date,
            columnStart: index % calendarWidthNum + 1,
            columnEnd: index % calendarWidthNum + 2,
            rowStart: Math.ceil((index + 1) / calendarWidthNum),
            rowEnd: Math.ceil((index + 1) / calendarWidthNum) + 1
    }));

    const getDateCoordinatesForEvent = (event: Event): DateGridItem[] => {
        return dateGridCoordinates.filter(gridItem => {
            return ((gridItem.date.toDateString() === event.start.toDateString())
            || (gridItem.date.toDateString() === event.end.toDateString())
            || (((gridItem.date.valueOf() >= event.start.valueOf())
            && (gridItem.date.valueOf() <= event.end.valueOf()))));
        });
    };

    const createEventObject = (
            event: Event, dateCoordinates: DateGridItem, isFirstRow: boolean
        ): CalendarEventObject => {
        return {
            event,
            columnStart: dateCoordinates.columnStart,
            columnEnd: dateCoordinates.columnEnd,
            rowStart: dateCoordinates.rowStart,
            isFirstRow
        };
    };

    const eventObjectsPerEvent: CalendarEventObject[] = props.eventsOnCalendar.map(event => {
        const eventDateCoordinates: DateGridItem[] = getDateCoordinatesForEvent(event);
        const initialValue: CalendarEventObject[] = [];
        const eventObjects: CalendarEventObject[] = eventDateCoordinates.reduce(
            (eventObjectsArray, dateCoordinates) => {
                const latestElIndex: number = eventObjectsArray.length - 1;
                if ((eventObjectsArray.length > 0) 
                && !(dateCoordinates.rowStart > eventObjectsArray[latestElIndex].rowStart)) {
                    const updatedRowObj: CalendarEventObject = {
                        ...eventObjectsArray[latestElIndex],
                        columnEnd: dateCoordinates.columnEnd
                    };
                    return eventObjectsArray.map((row, i) => 
                        (i === latestElIndex) ? updatedRowObj : row
                    );
                } else {
                    return eventObjectsArray.concat(
                        createEventObject(event, dateCoordinates, (eventObjectsArray.length === 0))
                    );
                };
        }, initialValue);
        return eventObjects;
    }).flat();

    const calendarEventRows: CalendarEventObject[][] = Array.from(
            { length: calendarHeightNum }, () => []
        ).map((_calendarRow, index) => {
        const eventsInCalendarRow: CalendarEventObject[] = eventObjectsPerEvent.filter(eventObj => 
            eventObj.rowStart === (index + 1)
        );
        const eventObjectsByLength: CalendarEventObject[] = eventsInCalendarRow.sort((a, b) => {
            const aLength: number = a.columnEnd - a.columnStart;
            const bLength: number = b.columnEnd - b.columnStart;
            return (bLength > aLength) ? 1 : -1;
        });
        return eventObjectsByLength;
    });

    return (
        <div className='CalendarEventsContainer'>
            {calendarEventRows.map((calendarEventRow, index) => 
                <CalendarEventsRow 
                    key={index}
                    eventRowObjects={calendarEventRow}
                    selection={props.selection}
                    eventFormData={props.eventFormData}
                    editEventMode={props.editEventMode}
                    setSelection={props.setSelection}
                />
            )}
        </div>
    );
};

export default CalendarEventsContainer;