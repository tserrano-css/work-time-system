import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedUserProfile1642332813082 implements MigrationInterface {
    name = 'AddedUserProfile1642332813082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-profile" ("name" character varying, "lastName" character varying, "phoneNumber" integer, "technologies" text array, "git_repos" text array, "profile_id" integer NOT NULL, CONSTRAINT "REL_aaff361c8c57ae3a9f4452b320" UNIQUE ("profile_id"), CONSTRAINT "PK_aaff361c8c57ae3a9f4452b320b" PRIMARY KEY ("profile_id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user-profile" ADD CONSTRAINT "FK_aaff361c8c57ae3a9f4452b320b" FOREIGN KEY ("profile_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-profile" DROP CONSTRAINT "FK_aaff361c8c57ae3a9f4452b320b"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phoneNumber" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying`);
        await queryRunner.query(`DROP TABLE "user-profile"`);
    }

}
