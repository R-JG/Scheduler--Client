import { useRef, useEffect, MouseEvent, ChangeEvent } from 'react';
import { 
    Event, 
    Selection, 
    EventFormData, 
    TimeSelectMode, 
    RowCoordinates, 
    ColumnCoordinates, 
    DayPanelEvent 
} from '../typeUtils/types';
import { 
    totalCalendarDatesNum, 
    hoursPerHourBlock, 
    expandedEventColumnWidth, 
    millisecondsInAnHour 
} from '../constants';
import DayPanelHourBlock from './DayPanelHourBlock';
import '../css/DayPanelContainer.css';

interface Props {
    currentDate: Date,
    calendarDates: Date[],
    calendarMonth: number,
    eventsOnCalendar: Event[],
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    createEventMode: boolean,
    timeSelectMode: TimeSelectMode,
    setSelection: (selection: Selection) => void,
    updateEventFormTimes: (date: Date) => void
};

const DayPanelContainer = (props: Props) => {

    const dayPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToDate(props.currentDate);
    }, []);

    useEffect(() => {
        if (((props.selection.type === 'date') 
        && (props.selection.source !== 'DayPanel')) 
        && (props.editEventMode === false)) {
            scrollToDate(props.selection.value);
        };
        if (props.selection.type === 'event') {
            scrollToEvent(props.selection.value);
        };
    }, [props.selection]);


    const getCalendarDateIndex = (date: Date): number => {
        return props.calendarDates.findIndex(calendarDate => 
            date.toDateString() === calendarDate.toDateString()
        );
    };

    const scrollToDate = (date: Date): void =>  {
        const dateIndex = getCalendarDateIndex(date);
        if (!dayPanelRef.current) return;
        /* 
            In the old version, the first children selector is set to 2  
            because the events and form containers are placed before.
        */
        dayPanelRef.current.children[1].children[dateIndex].scrollIntoView(
            { behavior: 'smooth', block: 'start' }
        );
    };

    const scrollToEvent = (event: Event): void => {
        /* 
            ############# Disabled until events are added #############

        const eventIndex = props.eventsOnCalendar.findIndex(eventOnCalendar => (
            event.eventId === eventOnCalendar.eventId
        ));
        if (!dayPanelRef.current) return;
        dayPanelRef.current.children[0].children[eventIndex].scrollIntoView(
            { behavior: 'smooth', block: 'start' }
        );
        */
    };

    // assumes that the id is a string consisting in a date in milliseconds, a space, and an hour number.
    const delegateHourClick = (e: MouseEvent<HTMLElement>): void => {
        if ((!(e.target instanceof HTMLElement)) 
        || (!(e.target.classList.contains('day-panel-hour')))) return;
        const idValues: string[] = e.target.id.split(' ');
        const hourMilliseconds: number = Number(idValues[idValues.length - 1]) * millisecondsInAnHour;
        const dateMilliseconds: number = Number(idValues[0]);
        const newDate: Date = new Date(dateMilliseconds + hourMilliseconds);
        if ((props.editEventMode || props.createEventMode)
        && (props.timeSelectMode.start || props.timeSelectMode.end)) {
            props.updateEventFormTimes(newDate);
        } else {
            props.setSelection({ source: 'DayPanel', type: 'date', value: newDate });
        };
    };

    const updateFormMinutes = (date: Date, minutes: number): void => {
        const newDate: Date = new Date(date);
        newDate.setMinutes(minutes)
        props.updateEventFormTimes(newDate);
    };

    const handleMinuteInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const inputValue: number = Number(e.target.value);
        if ((inputValue > 59) || (inputValue < 0)) return;
        if (props.timeSelectMode.start && props.eventFormData.start) {
            updateFormMinutes(props.eventFormData.start, inputValue);
        };
        if (props.timeSelectMode.end && props.eventFormData.end) {
            updateFormMinutes(props.eventFormData.end, inputValue);
        };
    };

    const getMinuteInputValue = (): number => {
        if (props.timeSelectMode.start && props.eventFormData.start) {
            return props.eventFormData.start.getMinutes();
        };
        if (props.timeSelectMode.end && props.eventFormData.end) {
            return props.eventFormData.end.getMinutes();
        };
        return 0;
    };

    const getGridRowCoordinates = (startDate: Date, endDate: Date): RowCoordinates => {
        const startDateIndex: number = getCalendarDateIndex(startDate);
        const endDateIndex: number = getCalendarDateIndex(endDate);
        const startDateNum: number = (startDateIndex === -1) ? 0 : startDateIndex;
        const endDateNum: number = (endDateIndex === -1) ? (totalCalendarDatesNum - 1) : endDateIndex;
        const rowStart: number = (startDateNum * hoursPerHourBlock) + (startDate.getHours() + 1);
        const rowEnd: number = (endDateNum * hoursPerHourBlock) + (endDate.getHours() + 2);
        return { rowStart, rowEnd };
    };


    const getSelectionMarkerCoordinates = (): RowCoordinates | undefined => {
        const start: Date | undefined = props.eventFormData.start;
        const end: Date | undefined = props.eventFormData.end;
        if (!start && !end) return;
        const startValue: Date = start ? start : end as Date;
        const endValue: Date = end ? end : start as Date;
        return getGridRowCoordinates(startValue, endValue);
    };

    const selectionMarkerCoordinates: RowCoordinates | undefined = getSelectionMarkerCoordinates();
    // put the selection marker in its own component?

    // have a separate day panel events container component?


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
            const eventRowCoordinates: RowCoordinates = getGridRowCoordinates(
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
        <div 
            className='DayPanelContainer'
            ref={dayPanelRef}
            onClick={delegateHourClick}
        >
            <div className='selection-marker-container'>
                {selectionMarkerCoordinates 
                && <div 
                    className='selection-marker' 
                    style={{
                        gridRow: `${selectionMarkerCoordinates.rowStart} / 
                            ${selectionMarkerCoordinates.rowEnd}`,
                        justifyContent: props.timeSelectMode.end ? 'flex-end' : 'flex-start'
                }}>
                    {((props.timeSelectMode.start && props.eventFormData.start) 
                    || (props.timeSelectMode.end && props.eventFormData.end)) 
                    && <div className='minute-selection-box'>
                        <input 
                            className='minute-input'
                            type='number' 
                            min='0' 
                            max='59'
                            value={getMinuteInputValue()}
                            onChange={handleMinuteInputChange}/>
                        <span>min</span>
                    </div>}
                </div>}
            </div>
            <div className='hour-blocks-container'>
                {props.calendarDates.map(date => 
                    <DayPanelHourBlock 
                        key={date.toDateString()}
                        date={date}
                        calendarMonth={props.calendarMonth}
                    />
                )}
            </div>
        </div>
    );
};

export default DayPanelContainer;