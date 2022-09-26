import { MigrationInterface, QueryRunner } from 'typeorm';

export class bikesTable1663430264059 implements MigrationInterface {
  name = 'bikesTable1663430264059';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "bikes_color_enum" AS ENUM('WHITE', 'BLACK', 'SILVER', 'GRAY', 'RED', 'BROWN', 'YELLOW', 'OLIVE', 'LIME', 'GREEN', 'AQUA', 'TEAL', 'BLUE', 'NAVY', 'PINK', 'VIOLET')`,
    );
    await queryRunner.query(
      `CREATE TYPE "bikes_type_enum" AS ENUM('ROADS_BIKES', 'MOUNTAIN_BIKES', 'HYBRID_BIKES', 'ELECTRIC_BIKES', 'TOURING_BIKES', 'FOLDING_BIKES', 'KIDS_BIKES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "bikes" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "license" character varying NOT NULL, "description" character varying NOT NULL, "color" "bikes_color_enum" NOT NULL, "date" TIMESTAMP NOT NULL, "type" "bikes_type_enum" NOT NULL, CONSTRAINT "UQ_ad9ecf5d56a8322835a79ad800f" UNIQUE ("license"), CONSTRAINT "PK_5237c1fcb162998a0d31e640814" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bikes"`);
    await queryRunner.query(`DROP TYPE "bikes_type_enum"`);
    await queryRunner.query(`DROP TYPE "bikes_color_enum"`);
  }
}
