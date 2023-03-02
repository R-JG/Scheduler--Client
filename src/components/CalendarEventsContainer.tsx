import { Event, Selection, EventFormData } from '../typeUtils/types';
import { calendarHeightNum, calendarWidthNum } from '../constants';
import CalendarEventsRow from './CalendarEventsRow';

interface DateGridItem {
    date: Date,
    columnStart: number,
    columnEnd: number,
    rowStart: number,
    rowEnd: number
};

interface EventObject {
    event: Event,
    columnStart: number,
    columnEnd: number,
    rowStart: number,
    isFirstRow: boolean
};

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
            event: Event, 
            dateCoordinates: DateGridItem, 
            isFirstRow: boolean
        ): EventObject => {
        return {
            event,
            columnStart: dateCoordinates.columnStart,
            columnEnd: dateCoordinates.columnEnd,
            rowStart: dateCoordinates.rowStart,
            isFirstRow
        };
    };

    const eventObjectsPerEvent: EventObject[] = props.eventsOnCalendar.map(event => {
        const eventDateCoordinates: DateGridItem[] = getDateCoordinatesForEvent(event);
        const accumulator: EventObject[] = [];
        const eventObjects: EventObject[] = eventDateCoordinates.reduce(
            (eventObjectsArray, dateCoordinates) => {
                const latestElIndex = eventObjectsArray.length - 1;
                if ((eventObjectsArray.length > 0) 
                && !(dateCoordinates.rowStart > eventObjectsArray[latestElIndex].rowStart)) {
                    const updatedRowObj = {
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
        }, accumulator);
        return eventObjects;
    }).flat();

    const calendarEventRows: EventObject[][] = Array.from(
        { length: calendarHeightNum }, () => []
    ).map((_calendarRow, index) => {
        const eventsInCalendarRow = eventObjectsPerEvent.filter(eventObj => 
            eventObj.rowStart === (index + 1)
        );
        const eventObjectsByLength = eventsInCalendarRow.sort((a, b) => {
            const aLength = a.columnEnd - a.columnStart;
            const bLength = b.columnEnd - b.columnStart;
            return (bLength > aLength) ? 1 : -1;
        });
        return eventObjectsByLength;
    });


    console.log('date grid coordinates:    ', dateGridCoordinates);
    console.log('first processing of events:    ', eventObjectsPerEvent);
    console.log('end product of calendar events:    ', calendarEventRows);
    

    return (
        <div className='CalendarEventsContainer'>
            {calendarEventRows.map(calendarEventRow => 
                <CalendarEventsRow 
                    eventObjects={calendarEventRow}
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