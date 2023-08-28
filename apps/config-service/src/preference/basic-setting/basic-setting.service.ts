import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IBasicSetting,
  IDepositConfig,
  IListDepositConfig,
  IMainConfig,
  IMemberConfig,
  INoticeConfig,
  ISiteSettings,
} from '@lib/common/interfaces/modules/preference';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import {
  DepositConfig,
  MainConfig,
  MemberConfig,
  NoticeConfig,
} from '@lib/core/databases/mongo';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class BasicSettingService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = BasicSettingService.name;

  constructor(
    logger: LoggerService,
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    private readonly configService: ConfigService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async createNoticeConfig(
    payload: Partial<INoticeConfig>,
  ): Promise<ResponseResult<NoticeConfig>> {
    try {
      const result = await this.create(
        this.dataSourceMongo,
        NoticeConfig,
        payload,
      );
      return result;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateNotice(
    payload: INoticeConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { noticeConfigId, isUseNotice, noticeMessage } = payload;
      await this.update(
        this.dataSourceMongo,
        NoticeConfig,
        { id: noticeConfigId },
        {
          isUseNotice,
          noticeMessage,
        },
      );
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateSite(
    payload: ISiteSettings,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const {
        mainConfigId,
        memberConfigId,
        companyName,
        memberRegisterLevel,
        realtimeNotice,
      } = payload;

      await Promise.all([
        this.update(
          this.dataSourceMongo,
          MainConfig,
          { id: mainConfigId },
          { companyName, realtimeNotice },
        ),
        this.update(
          this.dataSourceMongo,
          MemberConfig,
          { id: memberConfigId },
          { memberRegisterLevel },
        ),
      ]);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateMember(
    payload: IMemberConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.update(
        this.dataSourceMongo,
        MemberConfig,
        { id: payload.memberConfigId },

        payload,
      );
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createMemberConfig(
    payload: IMemberConfig,
  ): Promise<ResponseResult<MemberConfig>> {
    try {
      const memberConfig = await this.create(
        this.dataSourceMongo,
        MemberConfig,
        payload,
      );

      return memberConfig;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  reFormat(payload: IDepositConfig[]) {
    const output = payload.flatMap((item) => {
      const { type, ...levels } = item;
      return Object.entries(levels).map(([level, value]) => ({
        memberRegisterGroup: type.toUpperCase(),
        memberRegisterLevel: +level.replace('level', ''),
        value,
      }));
    });
    return output;
  }

  async updateDeposit(
    payload: IListDepositConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { mainConfigId, data } = payload;
      const reFormat = this.reFormat(data);

      const bulkOps = reFormat.map((doc) => ({
        updateOne: {
          filter: {
            memberRegisterGroup: doc.memberRegisterGroup,
            memberRegisterLevel: +doc.memberRegisterLevel,
            mainConfigId,
          },
          update: { $set: { value: doc.value } },
          upsert: true,
        },
      }));

      const depositModel = this.dataSourceMongo.models[DepositConfig.name];
      await depositModel.bulkWrite(bulkOps);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createDepositConfig(
    payload: IListDepositConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { mainConfigId, data } = payload;
      const reFormat = this.reFormat(data);

      const bulkOps = reFormat.map((doc) => ({
        insertOne: {
          document: { ...doc, mainConfigId },
        },
      }));

      const depositModel = this.dataSourceMongo.models[DepositConfig.name];
      await depositModel.bulkWrite(bulkOps);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createMainConfig(
    payload: IMainConfig,
  ): Promise<ResponseResult<MainConfig>> {
    try {
      const mainConfig = await this.create(
        this.dataSourceMongo,
        MainConfig,
        payload,
      );

      return mainConfig;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getBasicSetting(
    mainConfigId: string,
  ): Promise<ResponseResult<IBasicSetting>> {
    try {
      const {
        companyName,
        realtimeNotice,
        memberConfigId,
        id,
        noticeConfigId,
        isUseCouponItem,
      } = await this.getOne<MainConfig>(this.dataSourceMongo, MainConfig, {
        id: mainConfigId,
      });

      const [memberResult, depositResult, noticeResult] = await Promise.all([
        this.getOne<MemberConfig>(this.dataSourceMongo, MemberConfig, {
          id: memberConfigId,
        }),
        this.getMany(
          this.dataSourceMongo,
          DepositConfig,
          { mainConfigId },
          {
            query: { sort: { memberRegisterGroup: 1, memberRegisterLevel: 1 } },
          },
        ),
        this.getOne<NoticeConfig>(this.dataSourceMongo, NoticeConfig, {
          id: noticeConfigId,
        }),
      ]);

      const depositFormat = this.formatDepositResponse(depositResult);
      const {
        isAcceptRegisterMember,
        isInstantApproval,
        maximumRating,
        memberRegisterGroup,
        isSignUpLetter,
        memberRegisterLevel,
        messageWelcome,
        messageReply,
      } = memberResult;

      const { isUseNotice, noticeMessage } = noticeResult;
      return {
        companyName,
        realtimeNotice,

        depositResult: depositFormat,

        isUseCouponItem,
        isAcceptRegisterMember,
        isInstantApproval,
        maximumRating,
        memberRegisterGroup,
        isSignUpLetter,
        memberRegisterLevel,
        messageWelcome,
        messageReply,

        isUseNotice,
        noticeMessage,

        memberConfigId: memberResult.id,
        noticeConfigId: noticeResult.id,
        mainConfigId: id,
      };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  formatDepositResponse(entities: DepositConfig[]) {
    const hashMap = new Map();
    const prefix = 'level';

    entities.forEach((entity) => {
      const existingEntity = hashMap.get(entity.memberRegisterGroup) || {
        type: entity.memberRegisterGroup.toUpperCase(),
      };
      existingEntity[`${prefix + entity.memberRegisterLevel}`] = entity.value;
      hashMap.set(entity.memberRegisterGroup, existingEntity);
    });

    return Array.from(hashMap.values());
  }

  async getMemberConfig(): Promise<ResponseResult<MemberConfig>> {
    try {
      const mainConfigId = this.configService.get<string>('mainConfigId');
      const { memberConfigId } = await this.getOne<MainConfig>(
        this.dataSourceMongo,
        MainConfig,
        {
          id: mainConfigId,
        },
      );

      const memberConfig = await this.getOne(
        this.dataSourceMongo,
        MemberConfig,
        {
          id: memberConfigId,
        },
      );

      return memberConfig;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }
}
