import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [TemplateController],
})
export class TemplateModule {}
