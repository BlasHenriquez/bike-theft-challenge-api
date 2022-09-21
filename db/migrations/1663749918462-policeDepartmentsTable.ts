import { MigrationInterface, QueryRunner } from 'typeorm';

export class policeDepartmentsTable1663749918462 implements MigrationInterface {
  name = 'policeDepartmentsTable1663749918462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "police_departments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_398bc342d4432ed2bf335e9041f" UNIQUE ("name"), CONSTRAINT "PK_1e4c3af34a358ad43a883e10494" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "police_departments"`);
  }
}
