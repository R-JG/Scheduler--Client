import { ChangeEvent, FormEvent, MouseEvent } from 'react';
import { EventFormData, TimeSelectMode } from '../typeUtils/types';
import { generateTimeString } from '../helpers';
import '../css/EventCreationPanel.css';


interface Props {
    eventFormData: EventFormData,
    createEventMode: boolean,
    editEventMode: boolean,
    timeSelectMode: TimeSelectMode,
    setCreateEventMode: (boolean: boolean) => void,
    setTimeSelectMode: (params: TimeSelectMode) => void,
    updateEventFormValue: (name: string, value: string | Date) => void,
    addNewEvent: () => void,
    clearEventFormData: () => void
};

const EventCreationPanel = (props: Props) => {

    const closeCreateEventForm = (): void => {
        props.clearEventFormData();
        props.setTimeSelectMode(
            {start: false, end: false}
        );
        props.setCreateEventMode(false);
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        props.updateEventFormValue(name, value);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if ((props.eventFormData.start === undefined) 
            || (props.eventFormData.end === undefined)
            || (props.eventFormData.title === '')
        ) return;
        props.addNewEvent();
        closeCreateEventForm();
    };

    const handleSetTimeButtons = (e: MouseEvent<HTMLButtonElement>): void => {
        if (e.currentTarget.name === 'start') {
            props.setTimeSelectMode({
                start: !props.timeSelectMode.start,
                end: false
            });
        };
        if (e.currentTarget.name === 'end') {
            props.setTimeSelectMode({
                end: !props.timeSelectMode.end,
                start: false
            });
        };
    };

    return (
        <div className='EventCreationPanel'>
            {(props.createEventMode) 
            ?<form 
                className='event-creation-form'
                onSubmit={handleFormSubmit}
            >
                <button className='button--add-event'>
                    Add Event
                </button>
                <button 
                    type='button'
                    className='button--cancel-event-creation'
                    onClick={closeCreateEventForm}>
                    ✕
                </button>
                <label 
                    className='event-creation-title-label'
                    htmlFor='event-creation-form--title'>
                    Title:
                </label>
                <input 
                    id='event-creation-form--title'
                    type='text' 
                    name='title'
                    value={props.eventFormData.title}
                    onChange={handleFormChange}
                />
                <label 
                    className='event-creation-description-label'
                    htmlFor='event-creation-form--description'>
                    Description:
                </label>
                <textarea 
                    id='event-creation-form--description'
                    name='description'
                    value={props.eventFormData.description} 
                    onChange={handleFormChange}
                />
                <p className='event-creation-start-label'>
                    Start: 
                </p>
                <div className='event-creation-form--start'>
                    {props.eventFormData.start && 
                        <div className='event-creation-form--date-text'>
                            <div>{props.eventFormData.start.toDateString() + ', '}</div>
                            <div>{generateTimeString(props.eventFormData.start)}</div>
                        </div>
                    }
                    <button 
                        name='start'
                        className={
                            `button--set-start-time--EventCreationPanel 
                            ${(props.timeSelectMode.start) 
                                ? 'active-button' : ''}`}
                        type='button'
                        onClick={handleSetTimeButtons}>
                        Set Start Time
                    </button>
                </div>
                <p className='event-creation-end-label'>
                    End: 
                </p>
                <div className='event-creation-form--end'>
                    {props.eventFormData.end && 
                        <div className='event-creation-form--date-text'>
                        <div>{props.eventFormData.end.toDateString() + ', '}</div>
                        <div>{generateTimeString(props.eventFormData.end)}</div>
                    </div>
                    }
                    <button 
                        name='end'
                        className={
                            `button--set-end-time--EventCreationPanel 
                            ${(props.timeSelectMode.end) 
                                ? 'active-button' : ''}`}
                        type='button'
                        onClick={handleSetTimeButtons}>
                        Set End Time
                    </button>
                </div>
            </form>
            : <div className='event-creation-header'>
                <button
                    className={
                        `button--create-event 
                        ${props.editEventMode ? 'inactive-button' : ''}`}
                    onClick={() => 
                        !props.editEventMode ? props.setCreateEventMode(true) : undefined}
                > Create Event
                </button>
            </div>
            }
        </div>
    );
};

export default EventCreationPanel;