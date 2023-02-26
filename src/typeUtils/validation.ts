import { Event } from './types';

const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const isNumber = (params: unknown): params is number => {
    return ((typeof params === 'number') || (params instanceof Number));
};

const parseStringProp = (prop: unknown): string => {
    if (!isString(prop)) {
        throw new Error('property is incorrect type');
    };
    return prop;
};

const parseDateProp = (prop: unknown): Date => {
    if (!isNumber(prop)) {
        throw new Error('date property is not represented in milliseconds');
    };
    const date = new Date(prop);
    if (date.toString() === 'Invalid Date') {
        throw new Error('date property is incorrectly formatted');
    };
    return date;
};

const parseEvent = (params: unknown): Event => {
    if (!params || typeof params !== 'object') {
        throw new Error('incorrect or missing event data');
    };
    if (!(('eventId' in params) 
    && ('title' in params) 
    && ('description' in params) 
    && ('start' in params) 
    && ('end' in params))) {
        throw new Error('some properties are missing');
    };
    const event = {
        eventId: parseStringProp(params.eventId),
        title: parseStringProp(params.title),
        description: parseStringProp(params.description),
        start: parseDateProp(params.start),
        end: parseDateProp(params.end)
    };
    return event;
};

const parseEventsAray = (params: unknown): Event[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('incorrect or missing event array data');
    };
    const eventsArray = params.map(element => parseEvent(element));
    return eventsArray;
};

export default { parseEvent, parseEventsAray };