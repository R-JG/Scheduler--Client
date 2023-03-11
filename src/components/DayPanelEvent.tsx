import { FormEvent, ChangeEvent, MouseEvent } from 'react';
import { Event, Selection, EventFormData, TimeSelectMode, EventStyle } from '../typeUtils/types';
import '../css/DayPanelEvent.css';

interface Props {
    event: Event,
    style: EventStyle,
    selection: Selection,
    eventFormData: EventFormData,
    editEventMode: boolean,
    createEventMode: boolean,
    timeSelectMode: TimeSelectMode,
    setSelection: (selection: Selection) => void,
    setTimeSelectMode: (params: TimeSelectMode) => void,
    updateEventFormProperty: (name: string, value: string | Date) => void,
    stageEventEdit: (eventToEdit: Event) => void
    editEvent: () => void,
    endEventEdit: () => void
    deleteEvent: (eventId: string) => void
};

const DayPanelEvent = (props: Props) => {

    const eventIsSelected: boolean = (
        (props.selection.type === 'event') 
        && (props.selection.value.eventId === props.event.eventId) 
        && !props.editEventMode
    );

    const eventIsBeingEdited: boolean = (
        props.editEventMode && (props.eventFormData.eventId === props.event.eventId)
    );

    const handleEventClick = (): void => {
        if ((props.selection.type === 'event') 
        && (props.selection.value.eventId === props.event.eventId)) return;
        if (props.editEventMode 
        && (props.eventFormData.eventId !== props.event.eventId)) return;
        props.setSelection({ source: 'DayPanel', type: 'event', value: props.event });
    };

    const handleFormSubmit = (e: FormEvent): void => {
        e.preventDefault();
        if ((!props.eventFormData.start) 
        || (!props.eventFormData.end)
        || (props.eventFormData.title === '')
        ) return;
        props.editEvent();
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        props.updateEventFormProperty(name, value);
    };

    const handleFormTimeButtons = (e: MouseEvent<HTMLButtonElement>): void => {
        if (e.currentTarget.name === 'start')
        props.setTimeSelectMode({ start: !props.timeSelectMode.start, end: false });
        if (e.currentTarget.name === 'end')
        props.setTimeSelectMode({ start: false, end: !props.timeSelectMode.end });
    };

    const hasInactiveButtonClass = (): 'inactive-button' | '' => (
        props.createEventMode ? 'inactive-button' : ''
    );

    const createDateString = (date: Date | undefined): string => {
        if (!date) return '';
        const timeString: string = date.toLocaleTimeString();
        const newTimeString: string = (
            timeString.substring(0, (timeString.length - 6)) 
            + timeString.substring((timeString.length - 3), timeString.length)
        );
        return (date.toDateString() + ', ' + newTimeString);
    };

    return (
        <div 
            className='DayPanelEvent'
            style={props.style}
            onClick={handleEventClick}
        >
            {eventIsSelected
            && <div className='expanded-event'>
                <button 
                    className={
                        `button--edit-event 
                        ${hasInactiveButtonClass()}`}
                    onClick={() => props.stageEventEdit(props.event)}
                >
                    ⛭
                </button>
                <h1 className='expanded-event-title'>
                    {props.event.title}
                </h1>
                <div className='expanded-event-start'>
                    <p>From: </p>
                    {createDateString(props.event.start)}
                </div>
                <div className='expanded-event-end'>
                    <p>To: </p>
                    {createDateString(props.event.end)}
                </div>
                <p className='expanded-event-description'>
                    {props.event.description}
                </p>
            </div>}
            {eventIsBeingEdited 
            && <div className='expanded-event'>
                <form
                    className='event-edit-form'
                    onSubmit={handleFormSubmit}
                >
                    <button className='button--confirm-edit'>
                        Confirm Edit
                    </button>
                    <button 
                        type='button'
                        className='button--delete-event'
                        onClick={() => props.deleteEvent(props.event.eventId)}
                    >
                        Delete Event
                    </button>
                    <button
                        type='button'
                        className='button--cancel-edit'
                        onClick={props.endEventEdit}
                    >
                        Cancel Edit
                    </button>
                    <span className='event-edit-form--title-label'>
                        Title:
                    </span>
                    <input
                        className='event-edit-form--title'
                        type='text'
                        name='title'
                        value={props.eventFormData.title}
                        onChange={handleFormChange}
                    />
                    <span className='event-edit-form--description-label'>
                        Description:
                    </span>
                    <textarea
                        className='event-edit-form--description'
                        name='description'
                        value={props.eventFormData.description}
                        onChange={handleFormChange}
                    />
                    <span className='event-edit-form--start-label'>
                        Start:
                    </span>
                    <div className='event-edit-form--start'>
                        <p className='event-edit-form--start-value'>
                            {createDateString(props.eventFormData.start)}
                        </p>
                        <button 
                            name='start'
                            className={
                                `button--set-start-time--DayPanel 
                                ${(props.timeSelectMode.start) 
                                    ? 'active-button' : ''}`}
                            type='button'
                            onClick={handleFormTimeButtons}
                        >
                            Set Start Time
                        </button>
                    </div>
                    <span className='event-edit-form--end-label'>
                        End:
                    </span>
                    <div className='event-edit-form--end'>
                        <p className='event-edit-form--end-value'>
                            {createDateString(props.eventFormData.end)}
                        </p>
                        <button 
                            name='end'
                            className={
                                `button--set-end-time--DayPanel 
                                ${(props.timeSelectMode.end) 
                                    ? 'active-button' : ''}`}
                            type='button'
                            onClick={handleFormTimeButtons}
                        >
                            Set End Time
                        </button>
                    </div>  
                </form>
            </div>}
        </div>
    );
};

export default DayPanelEvent;