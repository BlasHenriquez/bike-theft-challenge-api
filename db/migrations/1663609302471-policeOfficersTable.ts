import { MigrationInterface, QueryRunner } from 'typeorm';

export class policeOfficersTable1663609302471 implements MigrationInterface {
  name = 'policeOfficersTable1663609302471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."police_officers_role_enum" AS ENUM('DIRECTOR', 'POLICE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."police_officers_status_enum" AS ENUM('FREE', 'BUSY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "police_officers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" "public"."police_officers_role_enum" NOT NULL DEFAULT 'POLICE', "status" "public"."police_officers_status_enum" NOT NULL DEFAULT 'FREE', CONSTRAINT "UQ_31dd3e85b4db882bf1544c9480c" UNIQUE ("email"), CONSTRAINT "PK_d4f598f83359be30ad438c8975b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "police_officers"`);
    await queryRunner.query(`DROP TYPE "public"."police_officers_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."police_officers_role_enum"`);
  }
}
