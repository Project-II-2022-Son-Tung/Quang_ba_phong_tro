import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddress1656225034529 implements MigrationInterface {
    name = 'UpdateAddress1656225034529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "provinces" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255), "full_name_en" character varying(255), "code_name" character varying(255), "administrative_unit_id" integer, "administrative_region_id" integer, CONSTRAINT "PK_f4b684af62d5cb3aa174f6b9b8a" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "wards" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255), "full_name_en" character varying(255), "code_name" character varying(255), "district_code" character varying(20) NOT NULL, "administrative_unit_id" integer, CONSTRAINT "PK_24f16d2207b1dcb6ce07d81d20f" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255), "full_name_en" character varying(255), "code_name" character varying(255), "province_code" character varying(20) NOT NULL, "administrative_unit_id" integer, CONSTRAINT "PK_8e9d73424149b43b38244f75528" PRIMARY KEY ("code"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "wards"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
    }

}
