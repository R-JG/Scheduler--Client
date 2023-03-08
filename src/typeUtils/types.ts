export interface DbFormattedEvent {
    eventId: string,
    title: string,
    description: string,
    color: string,
    startMilliseconds: number,
    endMilliseconds: number
};

export type NewDbFormattedEvent = Omit<DbFormattedEvent, 'eventId'>;

export interface Event {
    eventId: string,
    title: string,
    description: string,
    color: string,
    start: Date,
    end: Date
};

export type NewEvent = Omit<Event, 'eventId'>;

export interface EventFormData {
    eventId?: string,
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




export interface DateGridItem {
    date: Date,
    columnStart: number,
    columnEnd: number,
    rowStart: number,
    rowEnd: number
};

export interface EventGridItem {
    event: Event,
    columnStart: number,
    columnEnd: number,
    rowStart: number,
    rowEnd: number,
    isFirstRow: boolean
};

export type CalendarEvent = Omit<EventGridItem, 'rowEnd'>;

export type DayPanelEvent = Omit<EventGridItem, 'isFirstRow'>;

export interface EventStyle {
    gridColumn: string,
    gridRow: string,
    backgroundColor: string
};
