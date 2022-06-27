"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddress1656309744306 = void 0;
class UpdateAddress1656309744306 {
    name = 'UpdateAddress1656309744306';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "electricPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "waterPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "parkingFee" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "wifiFee" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "wifiFee" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "parkingFee" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "waterPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "electricPrice" SET NOT NULL`);
    }
}
exports.UpdateAddress1656309744306 = UpdateAddress1656309744306;
//# sourceMappingURL=1656309744306-UpdateAddress.js.map