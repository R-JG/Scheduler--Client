export interface DbFormatEvent {
    eventId: string,
    title: string,
    description: string,
    startMilliseconds: number,
    endMilliseconds: number
}; 

export type NewDbFormatEvent = Omit<DbFormatEvent, 'eventId'>;

export interface Event {
    eventId: string,
    title: string,
    description: string,
    start: Date,
    end: Date
};

export type NewEvent = Omit<Event, 'eventId'>;

export interface EventFormData {
    title: string,
    description: string,
    start: undefined | Date,
    end: undefined | Date
};

type SelectionSource = 'Calendar' | 'DayPanel';
export type Selection = 
    { source: SelectionSource, type: 'date', value: Date } 
    | { source: SelectionSource, type: 'event', value: Event };

export type TimeSelectMode = 
    { start: false, end: false } 
    | { start: true, end: false } 
    | { start: false, end: true };