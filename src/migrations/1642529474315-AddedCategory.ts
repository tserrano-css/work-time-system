import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCategory1642529474315 implements MigrationInterface {
    name = 'AddedCategory1642529474315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-profile" DROP CONSTRAINT "FK_aaff361c8c57ae3a9f4452b320b"`);
        await queryRunner.query(`ALTER TABLE "user-profile" ADD CONSTRAINT "UQ_aaff361c8c57ae3a9f4452b320b" UNIQUE ("profile_id")`);
        await queryRunner.query(`ALTER TABLE "user-profile" ADD CONSTRAINT "FK_aaff361c8c57ae3a9f4452b320b" FOREIGN KEY ("profile_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-profile" DROP CONSTRAINT "FK_aaff361c8c57ae3a9f4452b320b"`);
        await queryRunner.query(`ALTER TABLE "user-profile" DROP CONSTRAINT "UQ_aaff361c8c57ae3a9f4452b320b"`);
        await queryRunner.query(`ALTER TABLE "user-profile" ADD CONSTRAINT "FK_aaff361c8c57ae3a9f4452b320b" FOREIGN KEY ("profile_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
