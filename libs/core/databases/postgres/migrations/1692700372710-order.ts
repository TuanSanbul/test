import { MigrationInterface, QueryRunner } from 'typeorm';

export class Order1692700372710 implements MigrationInterface {
  name = 'Order1692700372710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order-detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" boolean NOT NULL DEFAULT false, "gameDetailId" uuid, "orderId" uuid, CONSTRAINT "PK_862c7676d91b1a10fa9c938825b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_state_enum" AS ENUM('PENDING', 'SUCCEED', 'CANCELED', 'REJECTED', 'APPROVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_currency_enum" AS ENUM('KRW', 'USD', 'VND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying(20) NOT NULL, "ipAddress" character varying(20) NOT NULL, "state" "public"."order_state_enum" NOT NULL, "betAmount" bigint NOT NULL DEFAULT '0', "expectWinning" bigint NOT NULL DEFAULT '0', "winningMoney" bigint NOT NULL DEFAULT '0', "rate" numeric NOT NULL DEFAULT '0', "winningOdd" numeric NOT NULL DEFAULT '0', "currency" "public"."order_currency_enum" NOT NULL, "memberId" uuid, CONSTRAINT "UQ_729b3eea7ce540930dbb7069498" UNIQUE ("code"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD CONSTRAINT "FK_1b977ee5fd3b7b1b137858fc3ae" FOREIGN KEY ("gameDetailId") REFERENCES "game-detail"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD CONSTRAINT "FK_c3a90f0a786e702eddac23c4e5c" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_f66dce68e327d1d1fdab81229fb" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_f66dce68e327d1d1fdab81229fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" DROP CONSTRAINT "FK_c3a90f0a786e702eddac23c4e5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" DROP CONSTRAINT "FK_1b977ee5fd3b7b1b137858fc3ae"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_currency_enum"`);
    await queryRunner.query(`DROP TYPE "public"."order_state_enum"`);
    await queryRunner.query(`DROP TABLE "order-detail"`);
  }
}
