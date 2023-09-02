import { ServiceName } from '@lib/common/enums';
import { ServiceResponseInterceptor } from '@lib/utils/middlewares';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CommunicateServiceModule } from './communicate-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CommunicateServiceModule);
  const configService = app.get(ConfigService);
  const config = configService.get(
    `services.${ServiceName.COMMUNICATE_SERVICE}`,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ServiceResponseInterceptor());

  app.init();
  app.connectMicroservice<MicroserviceOptions>(config);
  app.startAllMicroservices();
}
bootstrap();
