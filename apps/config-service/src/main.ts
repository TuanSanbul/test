import { ServiceName } from '@lib/common/enums';
import { ServiceResponseInterceptor } from '@lib/utils/middlewares';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ConfigServiceModule } from './config-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ConfigServiceModule);
  const configService = app.get(ConfigService);
  const config = configService.get(`services.${ServiceName.CONFIG_SERVICE}`);

  app.useGlobalInterceptors(new ServiceResponseInterceptor());

  app.init();
  app.connectMicroservice<MicroserviceOptions>(config);
  app.startAllMicroservices();
  const a = 3;
}
bootstrap();
