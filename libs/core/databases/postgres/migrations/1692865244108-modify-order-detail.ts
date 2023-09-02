import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOrderDetail1692865244108 implements MigrationInterface {
  name = 'ModifyOrderDetail1692865244108';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "order-detail" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."order-detail_result_enum" AS ENUM('WIN', 'LOST', 'DRAW', 'CANCELED', 'WAITING')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD "result" "public"."order-detail_result_enum" NOT NULL DEFAULT 'WAITING'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order-detail_state_enum" AS ENUM('PENDING', 'PROCESSING', 'CANCELED', 'REJECTED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD "state" "public"."order-detail_state_enum" NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."order_state_enum" RENAME TO "order_state_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_state_enum" AS ENUM('PENDING', 'PROCESSING', 'CANCELED', 'REJECTED', 'FAILED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "state" TYPE "public"."order_state_enum" USING "state"::"text"::"public"."order_state_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "state" SET DEFAULT 'PENDING'`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_state_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "state" SET DEFAULT 'PENDING'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_state_enum_old" AS ENUM('PENDING', 'SUCCEED', 'CANCELED', 'REJECTED', 'APPROVED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "state" TYPE "public"."order_state_enum_old" USING "state"::"text"::"public"."order_state_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_state_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_state_enum_old" RENAME TO "order_state_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "order-detail" DROP COLUMN "state"`);
    await queryRunner.query(`DROP TYPE "public"."order-detail_state_enum"`);
    await queryRunner.query(`ALTER TABLE "order-detail" DROP COLUMN "result"`);
    await queryRunner.query(`DROP TYPE "public"."order-detail_result_enum"`);
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD "status" boolean NOT NULL DEFAULT false`,
    );
  }
}
