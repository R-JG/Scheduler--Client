import { getHourString } from '../helpers';
import DayPanelHour from './DayPanelHour';
import '../css/DayPanelHourBlock.css';

interface Props {
    date: Date
};

const DayPanelHourBlock = (props: Props) => {

    const numberOfHours = 24;

    return (
        <div className='DayPanelHourBlock'>
            <div className='date-separator'>
                {props.date.toDateString()}
            </div>
            {Array.from({ length: numberOfHours }, (_, index) => 
                <DayPanelHour 
                    key={index}
                    hour={getHourString(index)}
                />
            )}
        </div>
    );
};

export default DayPanelHourBlock;