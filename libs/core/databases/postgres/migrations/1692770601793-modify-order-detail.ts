import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOrderDetail1692770601793 implements MigrationInterface {
  name = 'ModifyOrderDetail1692770601793';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD "odds" numeric NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD "handicap" numeric NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order-detail" DROP COLUMN "handicap"`,
    );
    await queryRunner.query(`ALTER TABLE "order-detail" DROP COLUMN "odds"`);
  }
}
