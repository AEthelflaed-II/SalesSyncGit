import { Global, Module } from '@nestjs/common';
import { EntityMessagesService } from './messages/entity-messages.service';

@Global()
@Module({
  providers: [EntityMessagesService],
  exports: [EntityMessagesService],
})
export class TemplateModule {}
