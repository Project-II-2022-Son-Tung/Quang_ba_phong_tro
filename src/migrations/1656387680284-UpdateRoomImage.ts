import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomImage1656387680284 implements MigrationInterface {
    name = 'UpdateRoomImage1656387680284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_image" DROP CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e"`);
        await queryRunner.query(`ALTER TABLE "room_image" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_image" ADD CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_image" DROP CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e"`);
        await queryRunner.query(`ALTER TABLE "room_image" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_image" ADD CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
