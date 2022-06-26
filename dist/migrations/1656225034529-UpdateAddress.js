"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddress1656225034529 = void 0;
class UpdateAddress1656225034529 {
    name = 'UpdateAddress1656225034529';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "provinces" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255), "full_name_en" character varying(255), "code_name" character varying(255), "administrative_unit_id" integer, "administrative_region_id" integer, CONSTRAINT "PK_f4b684af62d5cb3aa174f6b9b8a" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "wards" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255), "full_name_en" character varying(255), "code_name" character varying(255), "district_code" character varying(20) NOT NULL, "administrative_unit_id" integer, CONSTRAINT "PK_24f16d2207b1dcb6ce07d81d20f" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255), "full_name_en" character varying(255), "code_name" character varying(255), "province_code" character varying(20) NOT NULL, "administrative_unit_id" integer, CONSTRAINT "PK_8e9d73424149b43b38244f75528" PRIMARY KEY ("code"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "wards"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
    }
}
exports.UpdateAddress1656225034529 = UpdateAddress1656225034529;
//# sourceMappingURL=1656225034529-UpdateAddress.js.map