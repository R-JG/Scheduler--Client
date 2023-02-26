import axios from 'axios';
import { Event, NewEvent } from '../typeUtils/types';
import validation from '../typeUtils/validation';

const baseUrl = 'http://localhost:3000/api/events';

const getAllEvents = async (): Promise<Event[]> => {
    const response = await axios.get(baseUrl);
    const eventsArray = validation.parseEventsAray(response.data);
    return eventsArray;
};

const createEvent = async (newEvent: NewEvent): Promise<Event> => {
    const response = await axios.post(baseUrl, newEvent);
    const addedEvent = validation.parseEvent(response.data);
    return addedEvent;
};

export default { getAllEvents, createEvent };