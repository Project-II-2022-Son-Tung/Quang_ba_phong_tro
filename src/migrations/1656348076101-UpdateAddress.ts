import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddress1656348076101 implements MigrationInterface {
    name = 'UpdateAddress1656348076101'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "title" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "title"`);
    }

}
