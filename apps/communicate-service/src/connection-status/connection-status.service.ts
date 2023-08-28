import { BrowserMap, OSMap, TimeMaxLength } from '@lib/common/constants';
import { DbName, EConnStatusTab } from '@lib/common/enums';
import { IConnStatusMessage } from '@lib/common/interfaces/modules/connection-status';
import { BaseRepository } from '@lib/core/base';
import { LoginLog } from '@lib/core/databases/mongo';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { pick } from 'lodash';
import { Connection, PipelineStage } from 'mongoose';

@Injectable()
export class ConnectionStatusService extends BaseRepository {
  private readonly serviceName: string = ConnectionStatusService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getConnStatus(payload: IConnStatusMessage) {
    try {
      const { tab, startTime: fromPayload, endTime: toPayload } = payload;

      const toDate = toPayload ? new Date(toPayload) : new Date();
      const fromDate = fromPayload ? new Date(fromPayload) : new Date();
      if (!fromPayload) {
        fromDate.setFullYear(1997);

        if (!toPayload) {
          fromDate.setMonth(fromDate.getMonth() - 1);
        }
      }

      const data = {
        ...payload,
        startTime: fromDate,
        endTime: toDate,
      };

      const switchFunc = {
        [EConnStatusTab.Browser]: () =>
          this.getConnStatusByAgent(data, EConnStatusTab.Browser),
        [EConnStatusTab.OperatingSystem]: () =>
          this.getConnStatusByAgent(data, EConnStatusTab.OperatingSystem),
        [EConnStatusTab.Hour]: () =>
          this.getConnStatusByTime(data, EConnStatusTab.Hour),
        [EConnStatusTab.Date]: () =>
          this.getConnStatusByTime(data, EConnStatusTab.Date),
        [EConnStatusTab.Day]: () =>
          this.getConnStatusByTime(data, EConnStatusTab.Day),
        [EConnStatusTab.Month]: () =>
          this.getConnStatusByTime(data, EConnStatusTab.Month),
        [EConnStatusTab.Year]: () =>
          this.getConnStatusByTime(data, EConnStatusTab.Year),
        [EConnStatusTab.Default]: () => this.getConnStatusDefault(data),
      }[tab];

      if (!switchFunc) throw new NotFoundException();

      return switchFunc();
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  private async getConnStatusDefault(data: IConnStatusMessage) {
    const { startTime, endTime, page = 1, size = 10 } = data;

    const { results, pagination } = await this.getPagination(
      this.dataSourceMongo,
      LoginLog,
      { page, size },
      {
        createdAt: { $gte: startTime, $lte: endTime },
      },
      {
        projection: {
          id: 1,
          ipAddress: 1,
          deviceId: 1,
          deviceType: 1,
          memberId: 1,
          status: 1,
          userAgent: 1,
          createdAt: 1,
        },
      },
    );

    const mapResults = results.map((item) => {
      const browser = this.mapAgent(item.userAgent, EConnStatusTab.Browser);
      const os = this.mapAgent(item.userAgent, EConnStatusTab.OperatingSystem);
      const pickField = pick(item, [
        'id',
        'deviceId',
        'ipAddress',
        'deviceType',
        'memberId',
        'status',
        'userAgent',
        'createdAt',
      ]);

      return { ...pickField, browser, os };
    });

    return {
      results: mapResults,
      pagination,
    };
  }

  async getConnStatusByTime(data: IConnStatusMessage, type: EConnStatusTab) {
    const { startTime, endTime } = data;

    const [key, expression] = {
      [EConnStatusTab.Date]: ['date', '$dayOfWeek'],
      [EConnStatusTab.Day]: ['day', '$dayOfMonth'],
      [EConnStatusTab.Month]: ['month', '$month'],
      [EConnStatusTab.Year]: ['year', '$year'],
      [EConnStatusTab.Hour]: ['hour', '$hour'],
    }[type];

    const pipeline: PipelineStage[] = [
      {
        $match: { createdAt: { $gte: startTime, $lte: endTime } },
      },
      {
        $project: {
          [key]: { [expression]: '$createdAt' },
        },
      },
      {
        $group: {
          _id: `$${key}`,
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: 0,
          total: { $sum: '$count' },
          max: { $max: '$count' },
          groups: { $push: { key: '$_id', count: '$count' } },
        },
      },
      {
        $unwind: '$groups',
      },
      {
        $project: {
          _id: 0,
          [key]: '$groups.key',
          count: '$groups.count',
          rate: { $divide: ['$groups.count', '$total'] },
          bar: { $divide: ['$groups.count', '$max'] },
        },
      },
      {
        $sort: { [key]: 1 },
      },
    ];

    const model = this.getSchemaLessModel(this.dataSourceMongo, LoginLog);
    const results = await model.aggregate(pipeline);

    const checkNull = new Set();

    results.forEach((item) => {
      checkNull.add(+item[type]);
    });

    for (let i = 1; i <= TimeMaxLength[type]; i++) {
      if (!checkNull.has(i)) {
        results.splice(i - 1, 0, {
          [type]: i,
          count: 0,
          rate: 0,
          bar: 0,
        });
      }
    }

    return {
      results,
    };
  }

  async getConnStatusByAgent(
    data: IConnStatusMessage,
    type: EConnStatusTab.Browser | EConnStatusTab.OperatingSystem,
  ) {
    const { startTime = new Date(), endTime = new Date() } = data;

    const queryResult = await this.getMany(this.dataSourceMongo, LoginLog, {
      createdAt: { $gte: startTime, $lte: endTime },
    });

    let max = 0;
    const map = new Map();
    queryResult.forEach((item) => {
      const groupValue = {
        [EConnStatusTab.Browser]: this.mapAgent(
          item.userAgent,
          EConnStatusTab.Browser,
        ),
        [EConnStatusTab.OperatingSystem]: this.mapAgent(
          item.userAgent,
          EConnStatusTab.OperatingSystem,
        ),
      }[type];

      if (!map.has(groupValue)) {
        map.set(groupValue, {
          [type]: groupValue,
          count: 1,
        });
      } else {
        map.set(groupValue, {
          [type]: groupValue,
          count: map.get(groupValue).count + 1,
        });
      }

      max = map.get(groupValue).count > max ? map.get(groupValue).count : max;
    });

    const results = Array.from(map.values()).map((item) => ({
      ...item,
      rate: (item.count / queryResult.length) * 100,
      bar: (item.count / max) * 100,
    }));
    return {
      results,
    };
  }

  private mapAgent(agent: string, type: EConnStatusTab): string {
    const agentLower = agent.toLowerCase();

    const map = {
      [EConnStatusTab.Browser]: BrowserMap,
      [EConnStatusTab.OperatingSystem]: OSMap,
    }[type];

    for (const [key, value] of map) {
      if (agentLower.includes(key)) {
        return value;
      }
    }
    return '기타';
  }
}
