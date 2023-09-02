import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyMarket1692675151002 implements MigrationInterface {
  name = 'ModifyMarket1692675151002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "market" ALTER COLUMN "status" SET DEFAULT '2'`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" ADD CONSTRAINT "FK_424ab490c0459bdbaada1b35dba" FOREIGN KEY ("homeTeamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" ADD CONSTRAINT "FK_7e7e31eef2c1def341f396a67da" FOREIGN KEY ("awayTeamId") REFERENCES "team"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game-detail" DROP CONSTRAINT "FK_7e7e31eef2c1def341f396a67da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" DROP CONSTRAINT "FK_424ab490c0459bdbaada1b35dba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-detail" ALTER COLUMN "status" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "market" ALTER COLUMN "status" SET DEFAULT '1'`,
    );
  }
}
