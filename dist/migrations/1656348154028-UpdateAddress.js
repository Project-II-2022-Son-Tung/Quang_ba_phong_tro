"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddress1656348154028 = void 0;
class UpdateAddress1656348154028 {
    name = 'UpdateAddress1656348154028';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "title" SET NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "title" DROP NOT NULL`);
    }
}
exports.UpdateAddress1656348154028 = UpdateAddress1656348154028;
//# sourceMappingURL=1656348154028-UpdateAddress.js.map