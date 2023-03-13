import { useRef, useEffect, MouseEvent } from 'react';
import { Event, Selection, EventFormData, TimeSelectMode, RowCoordinates} from '../typeUtils/types';
import { totalCalendarDatesNum, hoursPerHourBlock, millisecondsInAnHour } from '../constants';
import DayPanelHourBlock from './DayPanelHourBlock';
import DayPanelEventsContainer from './DayPanelEventsContainer';
import DayPanelSelectionMarker from './DayPanelSelectionMarker';
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
    setTimeSelectMode: (params: TimeSelectMode) => void,
    updateEventFormProperty: (name: string, value: string | Date) => void,
    updateEventFormTimes: (date: Date) => void,
    stageEventEdit: (eventToEdit: Event) => void,
    editEvent: () => void,
    endEventEdit: () => void,
    deleteEvent: (eventId: string) => void
};

const DayPanelContainer = (props: Props) => {

    const dayPanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToDate(props.currentDate);
    }, []);

    useEffect(() => {
        if (((props.selection.type === 'date') 
        && (props.selection.source !== 'DayPanel')) 
        && (!props.editEventMode 
        || (props.editEventMode 
        && (props.timeSelectMode.start || props.timeSelectMode.end)))) {
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

    const hourBlocksContainerIndex: number = 2;

    const scrollToDate = (date: Date): void =>  {
        const dateIndex = getCalendarDateIndex(date);
        if (!dayPanelRef.current) return;
        dayPanelRef.current.children[hourBlocksContainerIndex].children[dateIndex]
            .scrollIntoView(
                { behavior: 'smooth', block: 'start' }
        );
    };

    const eventsContainerIndex: number = 0;

    const scrollToEvent = (event: Event): void => {
        props.eventsOnCalendar.forEach((_, index) => {
            if (!dayPanelRef.current) return;
            const childElement: Element | null = dayPanelRef
                .current.children[eventsContainerIndex].children.item(index);
            if (event.eventId === childElement?.id) {
                childElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        });
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

    const getGridRowCoordinates = (startDate: Date, endDate: Date): RowCoordinates => {
        const startDateIndex: number = getCalendarDateIndex(startDate);
        const endDateIndex: number = getCalendarDateIndex(endDate);
        const startDateNum: number = (startDateIndex === -1) ? 0 : startDateIndex;
        const endDateNum: number = (endDateIndex === -1) ? (totalCalendarDatesNum - 1) : endDateIndex;
        const rowStart: number = (startDateNum * hoursPerHourBlock) + (startDate.getHours() + 1);
        const rowEnd: number = (endDateNum * hoursPerHourBlock) + (endDate.getHours() + 2);
        return { rowStart, rowEnd };
    };


    return (
        <div 
            className='DayPanelContainer'
            ref={dayPanelRef}
            onClick={delegateHourClick}
        >
            <DayPanelEventsContainer 
                eventsOnCalendar={props.eventsOnCalendar}
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
                getGridRowCoordinates={getGridRowCoordinates}
            />
            <DayPanelSelectionMarker 
                eventFormData={props.eventFormData}
                timeSelectMode={props.timeSelectMode}
                updateEventFormTimes={props.updateEventFormTimes}
                getGridRowCoordinates={getGridRowCoordinates}
            />
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