import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomOwnerRate1657637957087 implements MigrationInterface {
    name = 'UpdateRoomOwnerRate1657637957087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "rate" real`);
        await queryRunner.query(`ALTER TABLE "owner" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "owner" ADD "rate" real`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owner" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "owner" ADD "rate" integer`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "rate"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "rate" integer`);
    }

}
