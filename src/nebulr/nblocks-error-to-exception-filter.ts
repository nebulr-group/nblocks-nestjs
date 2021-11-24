import { ForbiddenError, UnauthenticatedError } from '@nebulr-group/nblocks-ts-client';
import { Catch, ArgumentsHost, UnauthorizedException, ForbiddenException, } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(UnauthenticatedError, ForbiddenError)
export class NBlocksErrorToExceptionFilter extends BaseExceptionFilter {
  catch(exception: UnauthenticatedError | ForbiddenError, host: ArgumentsHost) {

    if (exception instanceof UnauthenticatedError) {
      super.catch(new UnauthorizedException(), host);
      return;
    }

    if (exception instanceof UnauthenticatedError) {
      super.catch(new ForbiddenException(), host);
      return;
    }

    // Fallback
    super.catch(exception, host);
  }
}
