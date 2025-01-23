import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator to set the event name metadata.
 * @param eventName - The name of the event to log.
 */
export const LogNblocksEvent = (eventName: string) => SetMetadata('eventName', eventName);
