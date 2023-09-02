import { mutationResult } from '@lib/common/constants';
import { DbName, EGameType } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IAttendanceBonus,
  IBonus,
  IBulletinBonus,
  IComboBonus,
  ICommentBonus,
  ICreateLevelRates,
  IListRechargeBonus,
  ILostBonus,
  IRechargeBonus,
  IUpdateAttendance,
  IUpdateAttendanceBonus,
  IUpdateBonusFolder,
  IUpdateBulletinBonus,
  IUpdateCommentBonus,
} from '@lib/common/interfaces/modules/preference';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import {
  AttendanceBonus,
  BulletinBonus,
  ComboBonus,
  CommentBonus,
  GameConfig,
  LevelRate,
  MainConfig,
  RechargeBonus,
  RechargeBonusItem,
} from '@lib/core/databases/mongo';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { lowerCase } from 'lodash';
import { Connection, PipelineStage } from 'mongoose';

@Injectable()
export class BonusSettingService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = BonusSettingService.name;

  constructor(
    logger: LoggerService,
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getBonusSetting(mainConfigId: string) {
    try {
      const [
        comboBonus,
        { attendanceBonus, bulletinBonus, commentBonus },
        { miniGame, sports, virtualGame },
        rechargeBonus,
        { limitComboQuantity, limitComboOdds, rechargeAmount },
      ] = await Promise.all([
        this.getComboBonus(mainConfigId),
        this.getAttendanceBonus(mainConfigId),
        this.getListGameBonus(mainConfigId),
        this.getRechargeBonus(mainConfigId, 1),
        this.getMainConfig(mainConfigId),
      ]);

      const bonusSettings = {
        bonusFolder: {
          comboBonus,
          limitComboQuantity,
          limitComboOdds,
        },
        attendanceBulletin: {
          attendanceBonus,
          bulletinBonus,
          commentBonus,
          rechargeAmount,
        },
        rechargeBonus,
        miniGame,
        sports,
        virtualGame,
      };

      return bonusSettings;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getComboBonus(mainConfigId: string) {
    const comboBonus = await this.getMany(
      this.dataSourceMongo,
      ComboBonus,
      { mainConfigId },
      {
        projection: ['id', 'quantity', 'odds'],
        query: { sort: { quantity: 1 } },
      },
    );
    return comboBonus;
  }

  async getMainConfig(mainConfigId: string) {
    const mainConfig = await this.getOne(
      this.dataSourceMongo,
      MainConfig,
      { id: mainConfigId },
      {
        projection: ['limitComboQuantity', 'limitComboOdds', 'rechargeAmount'],
      },
    );
    return mainConfig;
  }

  async getAttendanceBonus(mainConfigId: string) {
    const [attendanceResult, bulletinResult, commentResult] = await Promise.all(
      [
        this.getMany(
          this.dataSourceMongo,
          AttendanceBonus,
          { mainConfigId },
          {
            projection: ['id', 'daysOfAttendance', 'reward'],
            query: { sort: { daysOfAttendance: 1 } },
          },
        ),
        this.getMany(
          this.dataSourceMongo,
          BulletinBonus,
          { mainConfigId },
          {
            projection: ['id', 'quantity', 'reward'],
            query: { sort: { quantity: 1 } },
          },
        ),
        this.getMany(
          this.dataSourceMongo,
          CommentBonus,
          { mainConfigId },
          {
            projection: ['id', 'quantity', 'reward'],
            query: { sort: { quantity: 1 } },
          },
        ),
      ],
    );

    return {
      attendanceBonus: attendanceResult,
      bulletinBonus: bulletinResult,
      commentBonus: commentResult,
    };
  }

  async getListGameBonus(
    mainConfigId: string,
  ): Promise<Record<string, ILostBonus | object>> {
    const gameConfigModel = this.dataSourceMongo.models[GameConfig.name];
    const pipeline: PipelineStage[] = [
      {
        $match: {
          mainConfigId,
        },
      },
      {
        $lookup: {
          from: 'level_rate',
          localField: 'id',
          foreignField: 'gameConfigId',
          as: 'levelRates',
          pipeline: [
            { $sort: { level: 1 } },
            { $project: { id: 1, level: 1, rate: 1 } },
          ],
        },
      },
      {
        $project: {
          id: 1,
          status: 1,
          gameType: 1,
          userType: 1,
          applyDate: 1,
          levelRates: 1,
        },
      },
    ];
    const listBonus = await gameConfigModel.aggregate(pipeline);
    const listGameBonus = listBonus.reduce(
      (newObj, current) => {
        const lowerUserType = lowerCase(current.userType);
        if (current.gameType == EGameType.MiniGame)
          newObj.miniGame[lowerUserType] = current;
        if (current.gameType == EGameType.Sport)
          newObj.sports[lowerUserType] = current;
        if (current.gameType == EGameType.VirtualGame)
          newObj.virtualGame[lowerUserType] = current;

        return newObj;
      },
      {
        miniGame: {},
        sports: {},
        virtualGame: {},
      },
    );

    return listGameBonus;
  }

  async getRechargeBonus(
    mainConfigId: string,
    quantity: number,
  ): Promise<IRechargeBonus[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          mainConfigId,
        },
      },
      {
        $lookup: {
          from: 'recharge_bonus_item',
          localField: 'id',
          foreignField: 'rechargeBonusId',
          as: 'listItem',
          pipeline: [
            { $sort: { level: 1 } },
            {
              $project: {
                id: 1,
                firstRechargePercent: 1,
                rechargePercent: 1,
                rechargeName: 1,
                status: 1,
                type: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          id: 1,
          status: 1,
          level: 1,
          listItem: 1,
        },
      },
      { $limit: quantity },
    ];
    const rechargeModel = await this.getSchemaLessModel(
      this.dataSourceMongo,
      RechargeBonus,
    );
    const results = await rechargeModel.aggregate(pipeline);
    return results;
  }

  async getListRechargeBonus(
    mainConfigId: string,
  ): Promise<ResponseResult<IListRechargeBonus>> {
    try {
      const [rechargeBonus, chargeConfigInfo] = await Promise.all([
        this.getRechargeBonus(mainConfigId, 7),
        this.getOne(
          this.dataSourceMongo,
          MainConfig,
          { id: mainConfigId },
          {
            projection: {
              isUseFirstChargeBonus: true,
              firstChargePointBonus: true,

              isFCMaxPointApply: true,
              firstChargeMaxPoint: true,

              isRCMaxPointApply: true,
              RechargeMaxPoint: true,

              isMaxCoinBonusApply: true,
              firstChargeCoinBonus: true,
              rechargeCoinBonus: true,
            },
          },
        ),
      ]);

      return { rechargeBonus, chargeConfigInfo };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateListRecharge(
    payload: IListRechargeBonus,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { chargeConfigInfo, rechargeBonus = [] } = payload;
      const { mainConfigId } = chargeConfigInfo;

      const promise: Array<Promise<any>> = [];

      promise.push(
        this.update(
          this.dataSourceMongo,
          MainConfig,
          { id: mainConfigId },
          chargeConfigInfo,
        ),
      );

      rechargeBonus.forEach((item) => {
        promise.push(this.updateRecharge(item));
      });

      await Promise.all(promise);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createGameConfig(
    payload: Partial<IBonus>,
  ): Promise<ResponseResult<GameConfig>> {
    try {
      const result = this.create(this.dataSourceMongo, GameConfig, payload);

      return result;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createLevelRates(
    payload: Partial<ICreateLevelRates>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const levelRateModel = this.dataSourceMongo.models[LevelRate.name];
      const { gameConfigId, data } = payload;
      const bulkOps = data.map((item) => ({
        insertOne: {
          document: {
            gameConfigId,
            ...item,
          },
        },
      }));

      await levelRateModel.bulkWrite(bulkOps);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateGameBonus(
    payload: ILostBonus,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { user, recommender } = payload;
      const { levelRates: userLevelRates = [] } = user;
      const { levelRates: recomLevelRates = [] } = recommender;

      delete user.levelRates;
      delete recommender.levelRates;

      const levelRates = [...userLevelRates, ...recomLevelRates];

      const levelRateModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        LevelRate,
      );

      const bulkLevelRates = levelRates.map((item) => ({
        updateOne: {
          filter: {
            id: item.id,
          },
          update: { $set: item },
        },
      }));

      await Promise.all([
        levelRateModel.bulkWrite(bulkLevelRates),
        this.update(this.dataSourceMongo, GameConfig, { id: user.id }, user),
        this.update(
          this.dataSourceMongo,
          GameConfig,
          { id: recommender.id },
          recommender,
        ),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateBonusFolder(
    payload: IUpdateBonusFolder,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const {
        limitComboQuantity,
        mainConfigId,
        limitComboOdds,
        comboBonus = [],
      } = payload;

      const comboBonusModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        ComboBonus,
      );

      const bulkOps = comboBonus.map((item) => ({
        updateOne: {
          filter: {
            id: item.id,
          },
          update: { $set: item },
        },
      }));

      await Promise.all([
        comboBonusModel.bulkWrite(bulkOps),
        this.update(
          this.dataSourceMongo,
          MainConfig,
          { id: mainConfigId },
          { limitComboQuantity, limitComboOdds },
        ),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateRecharge(
    payload: IRechargeBonus,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { id, status, listItem = [] } = payload;
      const rechargeItemModel =
        this.dataSourceMongo.models[RechargeBonusItem.name];

      const bulkRecharge = listItem.map((item) => ({
        updateOne: {
          filter: {
            id: item.id,
          },
          update: { $set: item },
        },
      }));

      await Promise.all([
        this.update(this.dataSourceMongo, RechargeBonus, { id }, { status }),
        rechargeItemModel.bulkWrite(bulkRecharge),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createComboBonus(mainConfigId: string, data: IComboBonus[]) {
    try {
      const comboBonusModel = this.dataSourceMongo.models[ComboBonus.name];

      const bulkInsert = data.map((item) => ({
        insertOne: { document: { mainConfigId, ...item } },
      }));

      await comboBonusModel.bulkWrite(bulkInsert);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createRechargeBonus(payload: Partial<IRechargeBonus>) {
    try {
      await this.create(this.dataSourceMongo, RechargeBonus, payload);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createBulletinBonus(mainConfigId: string, data: IBulletinBonus[]) {
    try {
      const bulletinBonusModel =
        this.dataSourceMongo.models[BulletinBonus.name];

      const bulkInsert = data.map((item) => ({
        insertOne: { document: { mainConfigId, ...item } },
      }));

      await bulletinBonusModel.bulkWrite(bulkInsert);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createCommentBonus(mainConfigId: string, data: ICommentBonus[]) {
    try {
      const commentBonusModel = this.dataSourceMongo.models[CommentBonus.name];

      const bulkInsert = data.map((item) => ({
        insertOne: { document: { mainConfigId, ...item } },
      }));

      await commentBonusModel.bulkWrite(bulkInsert);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createAttendanceBonus(mainConfigId: string, data: IAttendanceBonus[]) {
    try {
      const attendanceBonusModel =
        this.dataSourceMongo.models[AttendanceBonus.name];

      const bulkInsert = data.map((item) => ({
        insertOne: { document: { mainConfigId, ...item } },
      }));

      await attendanceBonusModel.bulkWrite(bulkInsert);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateAttendance(payload: IUpdateAttendance) {
    try {
      const {
        attendanceBonus,
        bulletinBonus,
        commentBonus,
        rechargeAmount,
        mainConfigId,
      } = payload;

      await Promise.all([
        this.updateAttendanceBonus(attendanceBonus),
        this.updateCommentBonus(commentBonus),
        this.updateBulletinBonus(bulletinBonus),
        await this.update(
          this.dataSourceMongo,
          MainConfig,
          { id: mainConfigId },
          { rechargeAmount },
        ),
      ]);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async updateAttendanceBonus(payload: IUpdateAttendanceBonus[]) {
    try {
      const model = this.dataSourceMongo.models[AttendanceBonus.name];

      const bulkOps = payload.map((item) => ({
        updateOne: {
          filter: {
            id: item.id,
          },
          update: { $set: item },
        },
      }));

      await model.bulkWrite(bulkOps);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateCommentBonus(payload: IUpdateCommentBonus[]) {
    try {
      const model = this.dataSourceMongo.models[CommentBonus.name];

      const bulkOps = payload.map((item) => ({
        updateOne: {
          filter: {
            id: item.id,
          },
          update: { $set: item },
        },
      }));

      await model.bulkWrite(bulkOps);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateBulletinBonus(payload: IUpdateBulletinBonus[]) {
    try {
      const model = this.dataSourceMongo.models[BulletinBonus.name];

      const bulkOps = payload.map((item) => ({
        updateOne: {
          filter: {
            id: item.id,
          },
          update: { $set: item },
        },
      }));

      await model.bulkWrite(bulkOps);
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
