"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFavourite1656506089410 = void 0;
class UpdateFavourite1656506089410 {
    name = 'UpdateFavourite1656506089410';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "room_favourite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "roomId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_108489c9ae3e25a09a46b3e45f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room_favourite" ADD CONSTRAINT "FK_9c1e2625e7af302e4200667b341" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_favourite" ADD CONSTRAINT "FK_daa05b6e2ed2a82c0f4057d5b1a" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "room_favourite" DROP CONSTRAINT "FK_daa05b6e2ed2a82c0f4057d5b1a"`);
        await queryRunner.query(`ALTER TABLE "room_favourite" DROP CONSTRAINT "FK_9c1e2625e7af302e4200667b341"`);
        await queryRunner.query(`DROP TABLE "room_favourite"`);
    }
}
exports.UpdateFavourite1656506089410 = UpdateFavourite1656506089410;
//# sourceMappingURL=1656506089410-UpdateFavourite.js.map