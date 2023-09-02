import { Module } from '@nestjs/common';
import { LoginLogController } from './login-log.controller';

@Module({ controllers: [LoginLogController] })
export class LoginLogModule {}
