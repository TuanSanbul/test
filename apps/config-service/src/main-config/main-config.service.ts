import {
  getAttendanceData,
  getBulletinData,
  getComboData,
  getCommentData,
  getDepositData,
  getMainConfigData,
  getMarketConfigData,
  getRechargeData,
  getRechargeItemData,
  memberConfigData,
  noticeConfigData,
} from '@lib/common/constants';
import { DbName, EGameType, EUserType } from '@lib/common/enums';
import { IRoleInit } from '@lib/common/interfaces/modules/auth';
import { BaseRepository } from '@lib/core/base';
import {
  AttendanceBonus,
  BulletinBonus,
  ComboBonus,
  CommentBonus,
  DepositConfig,
  GameConfig,
  LevelRate,
  MainConfig,
  MarketConfig,
  MemberConfig,
  NoticeConfig,
  RechargeBonus,
  RechargeBonusItem,
} from '@lib/core/databases/mongo';
import { Bank } from '@lib/core/databases/mongo/entities/bank.entity';
import { Role } from '@lib/core/databases/postgres';
import { generateUnique } from '@lib/utils/helpers';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { Connection } from 'mongoose';
import { DataSource } from 'typeorm';

@Injectable()
export class MainConfigService extends BaseRepository implements OnModuleInit {
  private readonly serviceName: string = MainConfigService.name;
  private readonly logger: LoggerService;

  constructor(
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
    private readonly configService: ConfigService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async onModuleInit() {
    await this.initConfig();
  }

  async getOrCreateRole(roleName: string): Promise<Role> {
    try {
      const role = await this.getOne(this.dataSourcePostgres, Role, {
        where: { name: roleName },
      });

      if (role) return role;

      const newRole = this.createInstance(this.dataSourcePostgres, Role, {
        name: roleName,
      });

      await this.create(this.dataSourcePostgres, Role, newRole);

      return newRole;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initConfig(): Promise<void> {
    try {
      const { member } = this.configService.getOrThrow<IRoleInit>('roleInit');

      const [listMainConfig, roleMemberExist] = await Promise.all([
        this.getMany(this.dataSourceMongo, MainConfig),
        this.getOrCreateRole(member),
      ]);

      if (!isEmpty(listMainConfig)) return;

      const [memberConfig, noticeConfig] = await Promise.all([
        this.create(this.dataSourceMongo, MemberConfig, {
          ...memberConfigData,
          memberRegisterRole: roleMemberExist.id,
        }),
        this.create(this.dataSourceMongo, NoticeConfig, noticeConfigData),
      ]);

      const mainConfigConstant = getMainConfigData(
        memberConfig.id,
        noticeConfig.id,
      );
      const mainConfig = await this.create(this.dataSourceMongo, MainConfig, {
        ...mainConfigConstant,
        id: this.configService.get('mainConfigId') || generateUnique(),
      });

      await Promise.all([
        this.initBonusConfig(mainConfig.id),
        this.initDepositConfig(mainConfig.id),
        this.initGameConfig(mainConfig.id),
        this.initRechargeBonusConfig(mainConfig.id),
        this.initMarketConfig(),
        this.initBankConfig(),
      ]);
    } catch (error) {
      this.logger.error(error?.message);
    }
  }

  async initGameConfig(mainConfigId: string) {
    try {
      const levelRateModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        LevelRate,
      );

      const gameConfigModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        GameConfig,
      );

      const gameConfigList: GameConfig[] = [];

      for (const ukey in EUserType) {
        for (const gkey in EGameType) {
          gameConfigList.push({
            userType: EUserType[ukey],
            gameType: EGameType[gkey],
            status: false,
            applyDate: new Date(),
            mainConfigId,
          });
        }
      }
      const gameConfigResult = await gameConfigModel.insertMany<GameConfig>(
        gameConfigList,
      );
      const numArr = [...Array(5)].map((_, i) => i + 1);
      const levelRates = gameConfigResult.flatMap((item) => {
        return numArr.map((i) => ({
          level: i,
          rate: i,
          maxBet: 0,
          maxWinning: 0,
          gameConfigId: item.id,
        }));
      });

      await levelRateModel.insertMany<LevelRate>(levelRates);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async initDepositConfig(mainConfigId: string) {
    try {
      const depositList = getDepositData(mainConfigId);
      const depositConfigModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        DepositConfig,
      );

      await depositConfigModel.insertMany(depositList);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initMarketConfig() {
    try {
      const marketConfigList = getMarketConfigData();
      const marketConfigModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        MarketConfig,
      );

      await marketConfigModel.insertMany(marketConfigList);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initBankConfig() {
    try {
      const bankConfigList = getMarketConfigData();
      const bankConfigModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        Bank,
      );

      await bankConfigModel.insertMany(bankConfigList);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initRechargeBonusConfig(mainConfigId: string) {
    try {
      const rechargeList = getRechargeData(mainConfigId);

      const rechargeModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        RechargeBonus,
      );

      const rechargeItemModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        RechargeBonusItem,
      );

      const result = await rechargeModel.insertMany(rechargeList);
      const listRechargeItem = result.flatMap((item) => {
        return getRechargeItemData(item.id);
      });
      await rechargeItemModel.insertMany<RechargeBonusItem>(listRechargeItem);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initBonusConfig(mainConfigId: string) {
    try {
      const comboList = getComboData(mainConfigId);
      const attendanceList = getAttendanceData(mainConfigId);
      const bulletinList = getBulletinData(mainConfigId);
      const commentList = getCommentData(mainConfigId);

      const comboBonusModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        ComboBonus,
      );
      const attendanceBonusModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        AttendanceBonus,
      );
      const bulletinBonusModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        BulletinBonus,
      );
      const commentBonusModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        CommentBonus,
      );

      Promise.all([
        comboBonusModel.insertMany(comboList),
        attendanceBonusModel.insertMany(attendanceList),
        bulletinBonusModel.insertMany(bulletinList),
        commentBonusModel.insertMany(commentList),
      ]);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
