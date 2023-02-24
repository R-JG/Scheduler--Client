interface Props {
    date: Date
};

const CalendarDate = (props: Props) => {
    return (
        <div className='CalendarDate'>
            {props.date.getDate()}
        </div>
    );
};

export default CalendarDate;