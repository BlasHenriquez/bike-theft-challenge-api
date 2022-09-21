import { MigrationInterface, QueryRunner } from 'typeorm';

export class relationPoliceOfficerWithDepartment1663796176583
  implements MigrationInterface
{
  name = 'relationPoliceOfficerWithDepartment1663796176583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "police_departmets_police_officers" ("policeDepartmentsId" integer NOT NULL, "policeOfficersId" integer NOT NULL, CONSTRAINT "PK_64d04b4d1dc9964fb142716c87a" PRIMARY KEY ("policeDepartmentsId", "policeOfficersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf00d9aa213073022811074863" ON "police_departmets_police_officers" ("policeDepartmentsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8d067259d49b883fc8ffcdca26" ON "police_departmets_police_officers" ("policeOfficersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "police_departmets_police_officers" ADD CONSTRAINT "FK_cf00d9aa213073022811074863d" FOREIGN KEY ("policeDepartmentsId") REFERENCES "police_departments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "police_departmets_police_officers" ADD CONSTRAINT "FK_8d067259d49b883fc8ffcdca269" FOREIGN KEY ("policeOfficersId") REFERENCES "police_officers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "police_departmets_police_officers" DROP CONSTRAINT "FK_8d067259d49b883fc8ffcdca269"`,
    );
    await queryRunner.query(
      `ALTER TABLE "police_departmets_police_officers" DROP CONSTRAINT "FK_cf00d9aa213073022811074863d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8d067259d49b883fc8ffcdca26"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf00d9aa213073022811074863"`,
    );
    await queryRunner.query(`DROP TABLE "police_departmets_police_officers"`);
  }
}
