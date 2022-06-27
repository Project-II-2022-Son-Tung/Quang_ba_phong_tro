import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddress1656348154028 implements MigrationInterface {
    name = 'UpdateAddress1656348154028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "title" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "title" DROP NOT NULL`);
    }

}
