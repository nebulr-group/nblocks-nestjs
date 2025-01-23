// src/event/event.service.ts
import { Injectable } from '@nestjs/common';
import { NblocksClient, EventResponseDto, CreateEventRequestDto } from '@nebulr-group/nblocks-ts-client';
import { NebulrAuthService } from '../nebulr-auth/nebulr-auth.service';
import { ClientService } from '../shared/client/client.service';

@Injectable()
export class EventService {
    constructor(
        private readonly nebulrAuthService: NebulrAuthService,
        private readonly clientService: ClientService,
    ) { }

    async createEvent(args: CreateEventRequestDto): Promise<EventResponseDto> {
        const client = this._getInterceptedClient();
        return client.event.create(args);
    }

    async listEvents(): Promise<EventResponseDto[]> {
        const client = this._getInterceptedClient();
        return client.event.list();
    }

    async deleteEvent(eventId: string): Promise<void> {
        const client = this._getInterceptedClient();
        await client.event.delete(eventId);
    }

    private _getInterceptedClient(): NblocksClient {
        return this.clientService.getClient();
    }
}