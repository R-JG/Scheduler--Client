import { Event, NewEvent, DbFormattedEvent } from './types';


interface EventObjectBase {
    title: any,
    description: any,
    color: any,
    start: any,
    end: any
};


const isString = (params: unknown): params is string => {
    return ((typeof params === 'string') || (params instanceof String));
};

const isNumber = (params: unknown): params is number => {
    return ((typeof params === 'number') || (params instanceof Number));
};

const parseStringProp = (prop: unknown): string => {
    if (!isString(prop)) {
        throw new Error('incorrect property type');
    };
    return prop;
};

const parseNumberProp = (prop: unknown): number => {
    if (!isNumber(prop)) {
        throw new Error('incorrect property type');
    };
    return prop;
};

const parseDateProp = (prop: unknown): Date => {
    if (!(prop instanceof Date) || prop.toString() === 'Invalid Date') {
        throw new Error('missing or incorrect date property');
    };
    return prop;
};

const _parseEventObjectBase = (params: unknown): EventObjectBase => {
    if (!params || typeof params !== 'object') {
        throw new Error('incorrect or missing event data');
    };
    if (!(('title' in params) 
    && ('description' in params) 
    && ('color' in params) 
    && ('start' in params) 
    && ('end' in params))) {
        throw new Error('some properties are missing');
    };
    return params;
};

const parseNewEvent = (params: unknown): NewEvent => {
    const eventBase = _parseEventObjectBase(params);
    const event = {
        title: parseStringProp(eventBase.title),
        description: parseStringProp(eventBase.description),
        color: parseStringProp(eventBase.color),
        start: parseDateProp(eventBase.start),
        end: parseDateProp(eventBase.end)
    };
    return event;
};

const parseEvent = (params: unknown): Event => {
    const eventBase = _parseEventObjectBase(params);
    if (!('eventId' in eventBase)) {
        throw new Error('missing eventId property');
    };
    const event = {
        eventId: parseStringProp(eventBase.eventId),
        title: parseStringProp(eventBase.title),
        description: parseStringProp(eventBase.description),
        color: parseStringProp(eventBase.color),
        start: parseDateProp(eventBase.start),
        end: parseDateProp(eventBase.end)
    };
    return event;
};

const parseEventsArray = (params: unknown): Event[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('incorrect or missing event array data');
    };
    const eventsArray = params.map(element => parseEvent(element));
    return eventsArray;
};

const parseDbFormattedEvent = (params: unknown): DbFormattedEvent => {
    if (!params || typeof params !== 'object') {
        throw new Error('incorrect or missing event data');
    };
    if (!(('eventId' in params) 
    && ('title' in params) 
    && ('description' in params) 
    && ('color' in params) 
    && ('startMilliseconds' in params) 
    && ('endMilliseconds' in params))) {
        throw new Error('some properties are missing');
    };
    const dbEvent = {
        eventId: parseStringProp(params.eventId),
        title: parseStringProp(params.title),
        description: parseStringProp(params.description),
        color: parseStringProp(params.color),
        startMilliseconds: parseNumberProp(params.startMilliseconds),
        endMilliseconds: parseNumberProp(params.endMilliseconds)
    };
    return dbEvent;
};

const parseDbEventsArray = (params: unknown): DbFormattedEvent[] => {
    if (!params || !Array.isArray(params)) {
        throw new Error('incorrect or missing event array data');
    };
    const dbEventsArray = params.map(element => parseDbFormattedEvent(element));
    return dbEventsArray;
};


export default { 
    parseEvent, 
    parseNewEvent, 
    parseEventsArray, 
    parseDbFormattedEvent, 
    parseDbEventsArray 
};