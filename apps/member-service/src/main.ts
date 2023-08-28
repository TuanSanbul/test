import { ServiceName } from '@lib/common/enums';
import { ServiceResponseInterceptor } from '@lib/utils/middlewares';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MemberServiceModule } from './member-service.module';

async function bootstrap() {
  const app = await NestFactory.create(MemberServiceModule);
  const configService = app.get(ConfigService);
  const config = configService.get(`services.${ServiceName.MEMBER_SERVICE}`);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ServiceResponseInterceptor());

  global.SERVICE_NAME = ServiceName.MEMBER_SERVICE;

  app.init();
  app.connectMicroservice<MicroserviceOptions>(config);
  app.startAllMicroservices();
}
bootstrap();
