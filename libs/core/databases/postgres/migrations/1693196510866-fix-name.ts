import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixName1693196510866 implements MigrationInterface {
  name = 'FixName1693196510866';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game-feed-category" ("gameFeedId" uuid NOT NULL, "gameCategoryId" uuid NOT NULL, CONSTRAINT "PK_6584f7e40a2c025bed56210f4cd" PRIMARY KEY ("gameFeedId", "gameCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_924ff0942dd7f7d77ac1b84bf6" ON "game-feed-category" ("gameFeedId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ce22324b239bfb7b13e613ec0b" ON "game-feed-category" ("gameCategoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed-category" ADD CONSTRAINT "FK_924ff0942dd7f7d77ac1b84bf64" FOREIGN KEY ("gameFeedId") REFERENCES "game-feed"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed-category" ADD CONSTRAINT "FK_ce22324b239bfb7b13e613ec0b5" FOREIGN KEY ("gameCategoryId") REFERENCES "game-category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game-feed-category" DROP CONSTRAINT "FK_ce22324b239bfb7b13e613ec0b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed-category" DROP CONSTRAINT "FK_924ff0942dd7f7d77ac1b84bf64"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ce22324b239bfb7b13e613ec0b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_924ff0942dd7f7d77ac1b84bf6"`,
    );
    await queryRunner.query(`DROP TABLE "game-feed-category"`);
  }
}
