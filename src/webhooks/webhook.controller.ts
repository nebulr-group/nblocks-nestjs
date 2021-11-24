import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { EventWebhookDto } from '@nebulr-group/nblocks-ts-client'

@Controller('webhook')
export class WebhookController {
  @Post('')
  @HttpCode(200)
  async incoming(@Body() request: EventWebhookDto): Promise<void> {
    console.log('Received webhook', request);
    return;
  }
}
