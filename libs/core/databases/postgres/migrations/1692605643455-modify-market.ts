import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyMarket1692605643455 implements MigrationInterface {
  name = 'ModifyMarket1692605643455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game-detail" ADD "order" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "game-detail" DROP COLUMN "order"`);
  }
}
