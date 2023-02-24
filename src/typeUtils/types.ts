export interface SchedulerEvent {
    eventId: string,
    title: string,
    description: string,
    startMilliseconds: number,
    endMilliseconds: number
};

export type NewSchedulerEvent = Omit<SchedulerEvent, 'eventId'>;