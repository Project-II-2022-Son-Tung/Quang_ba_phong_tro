"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoomImage1656387680284 = void 0;
class UpdateRoomImage1656387680284 {
    name = 'UpdateRoomImage1656387680284';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room_image" DROP CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e"`);
        await queryRunner.query(`ALTER TABLE "room_image" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_image" ADD CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room_image" DROP CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e"`);
        await queryRunner.query(`ALTER TABLE "room_image" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_image" ADD CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.UpdateRoomImage1656387680284 = UpdateRoomImage1656387680284;
//# sourceMappingURL=1656387680284-UpdateRoomImage.js.map