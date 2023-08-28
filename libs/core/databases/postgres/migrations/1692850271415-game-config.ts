import { MigrationInterface, QueryRunner } from 'typeorm';

export class GameConfig1692850271415 implements MigrationInterface {
  name = 'GameConfig1692850271415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "game-type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying, "nameKo" character varying, "order" numeric DEFAULT '0', "isActive" boolean, "isAutoResult" boolean, "isAutoRegistration" boolean, "gameCategoryId" uuid NOT NULL, CONSTRAINT "PK_ac037da04aca5f072193eddba98" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game-category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying, CONSTRAINT "UQ_d83099cf3c4266691e902bfb86a" UNIQUE ("name"), CONSTRAINT "PK_80512a4826e86fc5eac4d250c6f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game-feed_game_categories_game-category" ("gameFeedId" uuid NOT NULL, "gameCategoryId" uuid NOT NULL, CONSTRAINT "PK_eb28a8208de3c86c65c232733ea" PRIMARY KEY ("gameFeedId", "gameCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3ae1b3dee7bea42cef6e2c113" ON "game-feed_game_categories_game-category" ("gameFeedId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_98fdd1f940cd9c3494dcb60228" ON "game-feed_game_categories_game-category" ("gameCategoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "game-type" ADD CONSTRAINT "FK_9a7a9ed6d95bb31a392f42816eb" FOREIGN KEY ("gameCategoryId") REFERENCES "game-category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed_game_categories_game-category" ADD CONSTRAINT "FK_b3ae1b3dee7bea42cef6e2c1138" FOREIGN KEY ("gameFeedId") REFERENCES "game-feed"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed_game_categories_game-category" ADD CONSTRAINT "FK_98fdd1f940cd9c3494dcb60228a" FOREIGN KEY ("gameCategoryId") REFERENCES "game-category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "game-feed_game_categories_game-category" DROP CONSTRAINT "FK_98fdd1f940cd9c3494dcb60228a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-feed_game_categories_game-category" DROP CONSTRAINT "FK_b3ae1b3dee7bea42cef6e2c1138"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game-type" DROP CONSTRAINT "FK_9a7a9ed6d95bb31a392f42816eb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_98fdd1f940cd9c3494dcb60228"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b3ae1b3dee7bea42cef6e2c113"`,
    );
    await queryRunner.query(
      `DROP TABLE "game-feed_game_categories_game-category"`,
    );
    await queryRunner.query(`DROP TABLE "game-category"`);
    await queryRunner.query(`DROP TABLE "game-type"`);
  }
}
