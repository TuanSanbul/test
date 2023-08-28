import { MigrationInterface, QueryRunner } from 'typeorm';

export class Partner1692806245590 implements MigrationInterface {
  name = 'Partner1692806245590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "partner-log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "memberId" uuid NOT NULL, "partnerTypeId" character varying NOT NULL, "totalPayment" bigint NOT NULL DEFAULT '0', "lastPayment" TIMESTAMP, CONSTRAINT "PK_6a18f6b89a51f57e2732eac0c73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_127f1d47a724ff53368f4a47fa" ON "partner-log" ("memberId", "partnerTypeId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "partner-log" ADD CONSTRAINT "FK_406aa912fd9d6257a123b0ad144" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partner-log" DROP CONSTRAINT "FK_406aa912fd9d6257a123b0ad144"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_127f1d47a724ff53368f4a47fa"`,
    );
    await queryRunner.query(`DROP TABLE "partner-log"`);
  }
}
