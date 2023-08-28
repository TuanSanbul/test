import { OrderState, ServiceName } from '@lib/common/enums';
import { IMoneyInsert } from '@lib/common/interfaces/modules/money';
import { BaseRepository } from '@lib/core/base';
import { GameDetail } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { getPattern } from '@lib/utils/helpers';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { OrderService } from '../order';

@Injectable()
export class TCPCallService extends BaseRepository {
  private readonly serviceName: string = TCPCallService.name;
  private readonly logger: LoggerService;
  constructor(
    logger: LoggerService,
    private readonly serviceClient: ServiceProviderBuilder,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getGameDetails(
    gameDetailIds: string[],
  ): Promise<Map<string, GameDetail>> {
    try {
      const pattern = {
        cmd: getPattern(
          [ServiceName.GAME_SERVICE, 'GameController'],
          'getGameDetail',
        ),
      };

      const gameDetails = await this.serviceClient.sendMessage(
        ServiceName.GAME_SERVICE,
        { payload: gameDetailIds },
        pattern,
      );

      return new Map(gameDetails.map((game: GameDetail) => [game.id, game]));
    } catch (error) {
      throw new HttpException(
        `[Game Service]: ${error?.message || 'Can not get game details'}`,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async modifyMemberMoney(
    memberId: string,
    payload: IMoneyInsert,
    orderId?: string,
  ): Promise<boolean> {
    try {
      const pattern = {
        cmd: getPattern(
          [ServiceName.MEMBER_SERVICE, 'MoneyController'],
          'insert',
        ),
      };

      await this.serviceClient.sendMessage(
        ServiceName.GAME_SERVICE,
        { payload, request: { memberId } },
        pattern,
      );

      if (orderId)
        await this.orderService.modifyStateOrder(
          orderId,
          OrderState.Processing,
        );

      return true;
    } catch (error) {
      if (orderId)
        await this.orderService.modifyStateOrder(orderId, OrderState.Failed);

      throw new HttpException(
        `[Member Service]: ${error?.message || 'Cannot modify member money'}`,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
