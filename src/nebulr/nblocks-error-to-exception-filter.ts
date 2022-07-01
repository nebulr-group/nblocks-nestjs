import { ForbiddenError, UnauthenticatedError } from '@nebulr-group/nblocks-ts-client';
import { Catch, ArgumentsHost, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

/**
 * This Filter makes sure that NestJS render a proper 401 or 403 responses for regular HTTP calls
 */
@Catch(UnauthenticatedError, ForbiddenError)
export class NBlocksErrorToExceptionFilter extends BaseExceptionFilter {
  catch(exception: UnauthenticatedError | ForbiddenError, host: ArgumentsHost) {

    if (exception instanceof UnauthenticatedError) {
      // Let graphql calls smoothly pass and be picked up by GraphQLModule
      if (host.getType() === 'http')
        super.catch(new UnauthorizedException(), host);
      return;
    }

    if (exception instanceof ForbiddenError) {
      // Let graphql calls smoothly pass and be picked up by GraphQLModule
      if (host.getType() === 'http')
        super.catch(new ForbiddenException(), host);
      return;
    }

    // Fallback
    super.catch(exception, host);
  }
}