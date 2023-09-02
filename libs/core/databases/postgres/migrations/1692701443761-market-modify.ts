import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarketModify1692701443761 implements MigrationInterface {
  name = 'MarketModify1692701443761';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7a9a0acce57a56c00716f7d4a1" ON "game-detail" ("marketId", "gameFeedId", "name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7a9a0acce57a56c00716f7d4a1"`,
    );
  }
}
