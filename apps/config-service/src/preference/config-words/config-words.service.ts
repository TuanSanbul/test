import { Injectable } from '@nestjs/common';
import { LoggerService } from '@lib/utils/modules';
import { GatewayError } from '@lib/utils/middlewares';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import {
  IUnavailableWord,
  IUpdateMessage,
} from '@lib/common/interfaces/modules/preference';
import { MemberConfig, MainConfig } from '@lib/core/databases/mongo';
import { DbName } from '@lib/common/enums';
import { BaseRepository } from '@lib/core/base';

@Injectable()
export class ConfigWordsService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = ConfigWordsService.name;

  constructor(
    logger: LoggerService,
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getUnavailableWords() {
    try {
      const result = await this.getOne<MainConfig>(
        this.dataSourceMongo,
        MainConfig,
        {},
      );

      return {
        id: result?.id,
        filterWord: result?.filterWord,
        prohibitedWord: result?.prohibitedWord,
      };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async setUnavailableWords(payload: IUnavailableWord) {
    try {
      const result = await this.update(
        this.dataSourceMongo,
        MainConfig,
        { id: payload.id },
        payload,
      );

      return result;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getMessageSetting() {
    try {
      const result = await this.getOne<MemberConfig>(
        this.dataSourceMongo,
        MemberConfig,
        {},
      );

      return {
        id: result?.id,
        messageWelcome: result?.messageWelcome,
        messageReply: result?.messageReply,
      };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async setReplyMessage(payload: IUpdateMessage) {
    try {
      const result = await this.update(
        this.dataSourceMongo,
        MemberConfig,
        { id: payload.id },
        { messageReply: payload.message },
      );

      return result;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async setRegisterMessage(payload: IUpdateMessage) {
    try {
      const result = await this.update(
        this.dataSourceMongo,
        MemberConfig,
        { id: payload.id },
        { messageWelcome: payload.message },
      );

      return result;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }
}
