import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [WebhookController],
})
export class WebhooksModule {}
