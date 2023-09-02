import { MigrationInterface, QueryRunner } from 'typeorm';

export class CouponModify1692693272312 implements MigrationInterface {
  name = 'CouponModify1692693272312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coupon-log" ADD "expireTime" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "coupon-log" DROP COLUMN "expireTime"`,
    );
  }
}
