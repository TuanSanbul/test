import { GatewaysName } from '@lib/common/constants';
import { IRequestLimit } from '@lib/common/interfaces';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { errorFormatter } from '@lib/utils/helpers';
import {
  GatewayExceptionFilter,
  GatewayResponseInterceptor,
  JwtGuard,
  RateLimiterInterceptor,
  RoleGuard,
  TimeoutInterceptor,
} from '@lib/utils/middlewares';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UserGatewayModule } from './user-gateway.module';
import { RoleEnv } from '@lib/common/enums';
import { CryptoService, UserAgentService } from '@lib/utils/modules';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Fingerprint = require('express-fingerprint');

async function bootstrap() {
  const app = await NestFactory.create(UserGatewayModule);
  const configService = app.get(ConfigService);

  const env = configService.get(`services.${GatewaysName.USER_GATEWAY}`);

  const reflector = new Reflector();
  const serviceClient = new ServiceProviderBuilder(configService);
  const memberRole = configService.get<string>('roleInit.member');

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['GET', 'POST'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errorFormatter(errors);
        return new BadRequestException([message]);
      },
    }),
  );
  const cryptoService = new CryptoService();
  const userAgentService = new UserAgentService(cryptoService);
  const requestLimitConfig = configService.get<IRequestLimit>('requestLimit');
  app.useGlobalInterceptors(
    new TimeoutInterceptor(),
    new GatewayResponseInterceptor(),
    new RateLimiterInterceptor(requestLimitConfig, userAgentService),
  );
  app.useGlobalFilters(new GatewayExceptionFilter());

  app.use(
    Fingerprint({
      parameters: [
        Fingerprint.useragent,
        Fingerprint.acceptHeaders,
        Fingerprint.geoip,
      ],
    }),
  );

  app.useGlobalGuards(new JwtGuard(serviceClient, reflector, userAgentService));
  app.useGlobalGuards(
    new RoleGuard(serviceClient, reflector, [memberRole, RoleEnv.All]),
  );

  const documentSetup = new DocumentBuilder()
    .setTitle('User-Gateway')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const slugDoc = configService.get('rootApi');
  const document = SwaggerModule.createDocument(app, documentSetup);
  SwaggerModule.setup(slugDoc, app, document);

  await app.listen(env.port);

  console.info(`User-Gateway is running on:`, env.port);
}
bootstrap();
