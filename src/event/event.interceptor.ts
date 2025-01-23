import { applyDecorators, CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata, UseInterceptors } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventService } from './event.service';

@Injectable()
export class EventInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector, // Used to retrieve metadata
    private readonly eventService: EventService, // Injected EventService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Retrieve the eventName metadata
    const eventName = this.reflector.get<string>('eventName', context.getHandler());

    return next.handle().pipe(
      tap(() => {
        if (eventName) {
          console.log('Intercepted Event Name:', eventName);
          // this.eventService.createEvent({ eventName }); // Trigger the event
        }
      }),
    );
  }
}

export function LogEvents(eventName: string) {
  return applyDecorators(
    UseInterceptors(EventInterceptor),
    SetMetadata('eventname', eventName)
  );
} 
