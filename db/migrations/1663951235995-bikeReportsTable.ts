import { MigrationInterface, QueryRunner } from 'typeorm';

export class bikeReportsTable1663951235995 implements MigrationInterface {
  name = 'bikeReportsTable1663951235995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."bike_reports_status_enum" AS ENUM('PENDING', 'INVESTIGATING', 'RESOLVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bike_reports" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "date_theft" TIMESTAMP NOT NULL, "address_theft" character varying NOT NULL, "description_theft" character varying NOT NULL, "status" "public"."bike_reports_status_enum" NOT NULL, "bike_id" integer, "police_officer_id" integer, CONSTRAINT "REL_3ea64cea3b2b9dbe3932cf8419" UNIQUE ("bike_id"), CONSTRAINT "PK_97da7bd4cfa790b4dd675dff97c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_reports" ADD CONSTRAINT "FK_3ea64cea3b2b9dbe3932cf84190" FOREIGN KEY ("bike_id") REFERENCES "bikes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_reports" ADD CONSTRAINT "FK_675712e496b08073a6b0f19d9e4" FOREIGN KEY ("police_officer_id") REFERENCES "police_officers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bike_reports" DROP CONSTRAINT "FK_675712e496b08073a6b0f19d9e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bike_reports" DROP CONSTRAINT "FK_3ea64cea3b2b9dbe3932cf84190"`,
    );
    await queryRunner.query(`DROP TABLE "bike_reports"`);
    await queryRunner.query(`DROP TYPE "public"."bike_reports_status_enum"`);
  }
}
