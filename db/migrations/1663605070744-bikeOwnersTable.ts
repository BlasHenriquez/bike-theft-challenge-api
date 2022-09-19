import { MigrationInterface, QueryRunner } from 'typeorm';

export class bikeOwnersTable1663605070744 implements MigrationInterface {
  name = 'bikeOwnersTable1663605070744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bike_owners" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, CONSTRAINT "UQ_9d9620e443941dac37ace38f3e0" UNIQUE ("email"), CONSTRAINT "PK_737d036fe4631250a1eb236592a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bike_owners"`);
  }
}
