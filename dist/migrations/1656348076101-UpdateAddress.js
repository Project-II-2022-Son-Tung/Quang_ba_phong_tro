"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAddress1656348076101 = void 0;
class UpdateAddress1656348076101 {
    name = 'UpdateAddress1656348076101';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" ADD "title" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "title"`);
    }
}
exports.UpdateAddress1656348076101 = UpdateAddress1656348076101;
//# sourceMappingURL=1656348076101-UpdateAddress.js.map