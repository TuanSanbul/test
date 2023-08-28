import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartnerModify1692941108603 implements MigrationInterface {
  name = 'PartnerModify1692941108603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_127f1d47a724ff53368f4a47fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner-log" DROP COLUMN "lastPayment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner-log" ADD "lastPayment" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_740f09056afa8e8ddc24b68477" ON "partner-log" ("memberId", "partnerTypeId", "lastPayment") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed" ADD CONSTRAINT "FK_34a8d5cf7084fb262e43d6e019a" FOREIGN KEY ("sportId") REFERENCES "sport"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed" ADD CONSTRAINT "FK_d319e592c92a3d8a71d38365c21" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed" ADD CONSTRAINT "FK_ce3c96d5a54a3d6e9edd80bbfa7" FOREIGN KEY ("nationId") REFERENCES "nation"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game-feed" DROP CONSTRAINT "FK_ce3c96d5a54a3d6e9edd80bbfa7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed" DROP CONSTRAINT "FK_d319e592c92a3d8a71d38365c21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed" DROP CONSTRAINT "FK_34a8d5cf7084fb262e43d6e019a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_740f09056afa8e8ddc24b68477"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner-log" DROP COLUMN "lastPayment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partner-log" ADD "lastPayment" TIMESTAMP`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_127f1d47a724ff53368f4a47fa" ON "partner-log" ("memberId", "partnerTypeId") `,
    );
  }
}
