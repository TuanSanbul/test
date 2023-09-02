import { ServiceName } from '@lib/common/enums';
import { ServiceResponseInterceptor } from '@lib/utils/middlewares';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CalculateServiceModule } from './calculate-service.module';

async function bootstrap() {
  const app = await NestFactory.create(CalculateServiceModule);
  const configService = app.get(ConfigService);
  const config = configService.get(`services.${ServiceName.CALCULATE_SERVICE}`);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ServiceResponseInterceptor());

  global.SERVICE_NAME = ServiceName.CALCULATE_SERVICE;

  app.init();
  app.connectMicroservice<MicroserviceOptions>(config);
  app.startAllMicroservices();
  const c = 1;
  const d = 1;
}
bootstrap();
