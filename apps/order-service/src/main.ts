import { ServiceName } from '@lib/common/enums';
import { ServiceResponseInterceptor } from '@lib/utils/middlewares';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);
  const configService = app.get(ConfigService);
  const config = configService.get(`services.${ServiceName.ORDER_SERVICE}`);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ServiceResponseInterceptor());

  global.SERVICE_NAME = ServiceName.ORDER_SERVICE;

  app.init();
  app.connectMicroservice<MicroserviceOptions>(config);
  app.startAllMicroservices();
}
bootstrap();
