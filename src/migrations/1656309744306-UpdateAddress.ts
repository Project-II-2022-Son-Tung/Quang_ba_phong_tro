import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddress1656309744306 implements MigrationInterface {
    name = 'UpdateAddress1656309744306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "electricPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "waterPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "parkingFee" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "wifiFee" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "wifiFee" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "parkingFee" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "waterPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "electricPrice" SET NOT NULL`);
    }

}
