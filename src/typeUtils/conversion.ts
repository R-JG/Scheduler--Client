import { Event, NewEvent, DbFormattedEvent, NewDbFormattedEvent } from './types';

export const newEventToDbFormat = (eventObj: NewEvent): NewDbFormattedEvent => {
    const dbEvent: NewDbFormattedEvent = { 
        title: eventObj.title,
        description: eventObj.description,
        color: eventObj.color,
        startMilliseconds: eventObj.start.valueOf(),
        endMilliseconds: eventObj.end.valueOf()
    };
    return dbEvent;
};

export const eventToDbFormat = (eventObj: Event): DbFormattedEvent => {
    const dbEvent: DbFormattedEvent = {
        eventId: eventObj.eventId,
        title: eventObj.title,
        description: eventObj.description,
        color: eventObj.color,
        startMilliseconds: eventObj.start.valueOf(),
        endMilliseconds: eventObj.end.valueOf()
    };
    return dbEvent;
};

export const dbFormatToEvent = (dbEvent: DbFormattedEvent): Event => {
    const event: Event = {
        eventId: dbEvent.eventId,
        title: dbEvent.title,
        description: dbEvent.description,
        color: dbEvent.color,
        start: new Date(dbEvent.startMilliseconds),
        end: new Date(dbEvent.endMilliseconds)
    };
    return event;
};
