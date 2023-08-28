import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyOrderDetail1692932229420 implements MigrationInterface {
  name = 'ModifyOrderDetail1692932229420';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD "gameCategoryId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" ADD CONSTRAINT "FK_b9e7e3f57df3d00c902ca8c8513" FOREIGN KEY ("gameCategoryId") REFERENCES "game-category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order-detail" DROP CONSTRAINT "FK_b9e7e3f57df3d00c902ca8c8513"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order-detail" DROP COLUMN "gameCategoryId"`,
    );
  }
}
