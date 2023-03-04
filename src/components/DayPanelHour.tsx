import '../css/DayPanelHour.css';

interface Props {
    hour: string
};

const DayPanelHour = (props: Props) => {
    return (
        <div className='DayPanelHour'>
            <div className='hour-text'>{props.hour}</div>
        </div>
    );
};

export default DayPanelHour;