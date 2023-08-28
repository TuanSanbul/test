import { MigrationInterface, QueryRunner } from 'typeorm';

export class MemberGameConfig1693197168174 implements MigrationInterface {
  name = 'MemberGameConfig1693197168174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "member-game-config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" boolean NOT NULL DEFAULT false, "firstChargePoint" numeric NOT NULL DEFAULT '0', "percentPerCharge" numeric NOT NULL DEFAULT '0', "winOdds" numeric NOT NULL DEFAULT '0', "lossOdds" numeric NOT NULL DEFAULT '0', "handicap" numeric NOT NULL DEFAULT '0', "dividendFor4Folders" numeric NOT NULL DEFAULT '0', "minimumDividendFor4Folders" numeric NOT NULL DEFAULT '0', "liveBetting" numeric NOT NULL DEFAULT '0', "payback" numeric NOT NULL DEFAULT '0', "memberId" uuid, CONSTRAINT "REL_f9f8801382cb87db13e8ebcd5a" UNIQUE ("memberId"), CONSTRAINT "PK_ecf048aadd30dfd89a0f10089b4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member-game-type" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isAvailability" boolean NOT NULL DEFAULT false, "status" boolean NOT NULL DEFAULT false, "maxBetAmount" numeric NOT NULL DEFAULT '0', "maxWinningAmount" numeric NOT NULL DEFAULT '0', "dividendRate" numeric NOT NULL DEFAULT '0', "losingPoint" numeric NOT NULL DEFAULT '0', "referralDropPoint" numeric NOT NULL DEFAULT '0', "miniGameBettingTime" numeric NOT NULL DEFAULT '0', "memberId" uuid, "gameTypeId" uuid, CONSTRAINT "PK_bc577df8ab063a39b2255e8d707" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-game-config" ADD CONSTRAINT "FK_f9f8801382cb87db13e8ebcd5a7" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-game-type" ADD CONSTRAINT "FK_bbcd08c6c9413e7213144040646" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-game-type" ADD CONSTRAINT "FK_313a923fc8defb2ab0e58ce4f25" FOREIGN KEY ("gameTypeId") REFERENCES "game-type"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "member-game-type" DROP CONSTRAINT "FK_313a923fc8defb2ab0e58ce4f25"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-game-type" DROP CONSTRAINT "FK_bbcd08c6c9413e7213144040646"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-game-config" DROP CONSTRAINT "FK_f9f8801382cb87db13e8ebcd5a7"`,
    );
    await queryRunner.query(`DROP TABLE "member-game-type"`);
    await queryRunner.query(`DROP TABLE "member-game-config"`);
  }
}
