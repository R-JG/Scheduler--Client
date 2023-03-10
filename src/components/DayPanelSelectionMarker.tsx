import { ChangeEvent } from 'react';
import { EventFormData, TimeSelectMode, RowCoordinates } from '../typeUtils/types';
import '../css/DayPanelSelectionMarker.css';

interface Props {
    eventFormData: EventFormData,
    timeSelectMode: TimeSelectMode,
    updateEventFormTimes: (date: Date) => void,
    getGridRowCoordinates: (startDate: Date, endDate: Date) => RowCoordinates
};

const DayPanelSelectionMarker = (props: Props) => {

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

    const getSelectionMarkerCoordinates = (): RowCoordinates | undefined => {
        const start: Date | undefined = props.eventFormData.start;
        const end: Date | undefined = props.eventFormData.end;
        if (!start && !end) return;
        const startValue: Date = start ? start : end as Date;
        const endValue: Date = end ? end : start as Date;
        return props.getGridRowCoordinates(startValue, endValue);
    };

    const selectionMarkerCoordinates: RowCoordinates | undefined = getSelectionMarkerCoordinates();


    return (
        <div className='DayPanelSelectionMarker'>
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
    );
};

export default DayPanelSelectionMarker;