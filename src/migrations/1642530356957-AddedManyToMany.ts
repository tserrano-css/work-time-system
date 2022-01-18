import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedManyToMany1642530356957 implements MigrationInterface {
    name = 'AddedManyToMany1642530356957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_categori" ("projectId" integer NOT NULL, "categoriId" uuid NOT NULL, CONSTRAINT "PK_55fe21d0846920412ee7d4ad70b" PRIMARY KEY ("projectId", "categoriId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_118b873388d330411866375ca1" ON "project_categori" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f185a69d66ebeac32e9a0d9f9" ON "project_categori" ("categoriId") `);
        await queryRunner.query(`ALTER TABLE "project_categori" ADD CONSTRAINT "FK_118b873388d330411866375ca1f" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_categori" ADD CONSTRAINT "FK_0f185a69d66ebeac32e9a0d9f92" FOREIGN KEY ("categoriId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_categori" DROP CONSTRAINT "FK_0f185a69d66ebeac32e9a0d9f92"`);
        await queryRunner.query(`ALTER TABLE "project_categori" DROP CONSTRAINT "FK_118b873388d330411866375ca1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f185a69d66ebeac32e9a0d9f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_118b873388d330411866375ca1"`);
        await queryRunner.query(`DROP TABLE "project_categori"`);
    }

}
