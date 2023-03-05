import '../css/DayPanelHour.css';

interface Props {
    id: string,
    hour: string
};

const DayPanelHour = (props: Props) => {
    return (
        <div className='DayPanelHour' id={props.id}>
            <div className='hour-text'>{props.hour}</div>
        </div>
    );
};

export default DayPanelHour;