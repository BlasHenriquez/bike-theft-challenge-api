import { MigrationInterface, QueryRunner } from 'typeorm';

export class relationBikeOwnerWithBikes1663788399370
  implements MigrationInterface
{
  name = 'relationBikeOwnerWithBikes1663788399370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bikes" ADD "bike_owner_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bikes" ADD CONSTRAINT "FK_a3d3935da0ce9f95a758662fe72" FOREIGN KEY ("bike_owner_id") REFERENCES "bike_owners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bikes" DROP CONSTRAINT "FK_a3d3935da0ce9f95a758662fe72"`,
    );
    await queryRunner.query(`ALTER TABLE "bikes" DROP COLUMN "bike_owner_id"`);
  }
}
