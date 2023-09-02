import { DbName, RegisterCodeType } from '@lib/common/enums';
import { IAccountInit, IRoleInit } from '@lib/common/interfaces/modules/auth';
import { BaseRepository } from '@lib/core/base';
import { Member } from '@lib/core/databases/postgres';
import { CryptoService, LoggerService } from '@lib/utils/modules';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RegisterCodeService } from './register-code';
import { RoleService } from './role';

@Injectable()
export class MemberInitService extends BaseRepository implements OnModuleInit {
  private readonly serviceName: string = MemberInitService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
    private readonly roleService: RoleService,
    private readonly registerCodeService: RegisterCodeService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async onModuleInit() {
    await this.initAccount();
  }

  async initAccount(): Promise<void> {
    try {
      const initAccount = this.configService.get<IAccountInit>('initAccount');
      const { admin: roleAdmin } =
        this.configService.get<IRoleInit>('roleInit');

      const { username, phone } = initAccount;
      let { password, exchangePassword } = initAccount;

      [password, exchangePassword] = [
        this.cryptoService.computeSHA1OfMD5(password),
        this.cryptoService.computeSHA1OfMD5(exchangePassword),
      ];

      const [checkExistedMember, role] = await Promise.all([
        this.exist(this.dataSourcePostgres, Member, {
          nickName: username,
        }),
        this.roleService.getOrCreate(roleAdmin),
      ]);
      if (checkExistedMember) return;

      const member = await this.create(this.dataSourcePostgres, Member, {
        phone,
        role,
        username,
        password,
        exchangePassword,
        nickName: username,
        fullName: username,
      });

      await this.registerCodeService.createRegisterCode({
        bonus: 0,
        recommendCode: username,
        registeredDomain: null,
        type: RegisterCodeType.Partner,
        memberId: member.id,
      });

      this.logger.log('Admin account is created');
    } catch (error) {
      this.logger.error(error?.message);
    }
  }
}
