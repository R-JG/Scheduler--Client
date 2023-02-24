export interface SchedulerEvent {
    eventId: string,
    title: string,
    description: string,
    startMilliseconds: number,
    endMilliseconds: number
};

export type NewSchedulerEvent = Omit<SchedulerEvent, 'eventId'>;

type SelectionSource = 'Calendar' | 'DayPanel';
export type Selection = { source: SelectionSource, type: 'date', value: Date } | { source: SelectionSource, type: 'event', value: SchedulerEvent };
