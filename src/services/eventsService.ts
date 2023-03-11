import axios from 'axios';
import { DbFormattedEvent, NewDbFormattedEvent } from '../typeUtils/types';
import validation from '../typeUtils/validation';

const baseUrl = '/api/events';

const getAllEvents = async (): Promise<DbFormattedEvent[] | undefined> => {
    try {
        const response = await axios.get(baseUrl, { validateStatus: status => status < 400 });
        const dbEventsArray = validation.parseDbEventsArray(response.data);
        return dbEventsArray;
    } catch (error: any) {
        console.log(error.message);
    };
};

const addEvent = async (newDbEvent: NewDbFormattedEvent): Promise<DbFormattedEvent | undefined> => {
    try {
        const response = await axios.post(
            baseUrl, 
            newDbEvent, 
            { validateStatus: status => status < 400 }
        );
        const addedDbEvent = validation.parseDbFormattedEvent(response.data);
        return addedDbEvent;
    } catch (error: any) {
        console.log(error.message);
    };
};

const editEvent = async (eventUpdate: DbFormattedEvent): Promise<DbFormattedEvent | undefined> => {
    try {
        const response = await axios.put(
            `${baseUrl}/${eventUpdate.eventId}`, 
            eventUpdate, 
            { validateStatus: status => status < 400 }
        );
        const updatedDbEvent = validation.parseDbFormattedEvent(response.data);
        return updatedDbEvent;
    } catch (error: any) {
        console.log(error.message);
    };
};

const deleteEvent = async (eventId: string): Promise<DbFormattedEvent | undefined> => {
    try {
        const response = await axios.delete(
            `${baseUrl}/${eventId}`, 
            { validateStatus: status => status < 400 }
        );
        const deletedDbEvent = response.data;
        return deletedDbEvent;
    } catch (error: any) {
        console.log(error.message);
    };
};

export default { getAllEvents, addEvent, editEvent, deleteEvent };