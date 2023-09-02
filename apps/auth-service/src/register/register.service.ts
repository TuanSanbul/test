import { mutationResult } from '@lib/common/constants';
import { DbName, ServiceName } from '@lib/common/enums';
import { IRegisterMember } from '@lib/common/interfaces/modules/auth';
import { IMutationResponse } from '@lib/common/interfaces/response';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { MemberConfig } from '@lib/core/databases/mongo';
import { Member, RegisterCode } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { getPattern } from '@lib/utils/helpers';
import { GatewayError } from '@lib/utils/middlewares';
import { CryptoService, LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RegisterService extends BaseRepository {
  private readonly serviceName: string = RegisterService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly cryptoService: CryptoService,
    private readonly serviceClient: ServiceProviderBuilder,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getMemberConfig(): Promise<MemberConfig> {
    try {
      const pattern = {
        cmd: getPattern(
          [ServiceName.CONFIG_SERVICE, 'BasicSettingController'],
          'getMemberConfig',
        ),
      };
      const config = await this.serviceClient.sendMessage(
        ServiceName.CONFIG_SERVICE,
        {},
        pattern,
      );

      return config;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async initGameConfig(member: Member, gameType = false) {
    try {
      const pattern = {
        cmd: getPattern(
          [ServiceName.MEMBER_SERVICE, 'GameConfigController'],
          gameType ? 'initGameTypes' : 'initGameConfig',
        ),
      };

      const message = { payload: member };

      const config = await this.serviceClient.sendMessage(
        ServiceName.MEMBER_SERVICE,
        message,
        pattern,
      );

      return config;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(
    payload: IRegisterMember,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { username, nickName, recommenderCode, ...member } = payload;
      let { password, exchangePassword } = payload;

      const [checkExistedAccount, registerCode, config] = await Promise.all([
        this.getMany(this.dataSourcePostgres, Member, {
          where: [{ username }, { nickName }],
        }),
        this.getOne(this.dataSourcePostgres, RegisterCode, {
          where: {
            recommendCode: recommenderCode,
          },
          relations: {
            owner: {
              recommended: true,
            },
          },
        }),
        this.getMemberConfig(),
      ]);

      if (!config) throw new NotFoundException('Not found config');
      if (!registerCode)
        throw new BadRequestException('RecommendCode is not exist');
      if (checkExistedAccount.length > 0)
        throw new BadRequestException('Username or Nickname existed');

      [password, exchangePassword] = [
        this.cryptoService.computeSHA1OfMD5(password),
        this.cryptoService.computeSHA1OfMD5(exchangePassword),
      ];

      const newMember = this.createInstance(this.dataSourcePostgres, Member, {
        ...member,
        username,
        password,
        nickName,
        exchangePassword,
        level: config.memberRegisterLevel,
        group: config.memberRegisterGroup,
        recommender: registerCode.owner,
        recommendedCode: registerCode,
        role: { id: config.memberRegisterRole },
      });

      await this.dataSourcePostgres.manager.save(Member, [
        newMember,
        {
          ...registerCode.owner,
          recommended: [newMember, ...registerCode.owner.recommended],
        },
      ]);

      await Promise.all([
        this.initGameConfig(newMember),
        this.initGameConfig(newMember, true),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
