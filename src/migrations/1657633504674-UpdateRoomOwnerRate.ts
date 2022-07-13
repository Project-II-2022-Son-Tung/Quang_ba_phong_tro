import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoomOwnerRate1657633504674 implements MigrationInterface {
    name = 'UpdateRoomOwnerRate1657633504674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "numberOfRates" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "owner" ADD "numberOfRates" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "owner_rate" DROP CONSTRAINT "FK_8066d6197dfc7711ae54ce52e83"`);
        await queryRunner.query(`ALTER TABLE "owner_rate" DROP CONSTRAINT "FK_4e8635af932faaf46cfb3e5af19"`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ADD CONSTRAINT "FK_8066d6197dfc7711ae54ce52e83" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ADD CONSTRAINT "FK_4e8635af932faaf46cfb3e5af19" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owner_rate" DROP CONSTRAINT "FK_4e8635af932faaf46cfb3e5af19"`);
        await queryRunner.query(`ALTER TABLE "owner_rate" DROP CONSTRAINT "FK_8066d6197dfc7711ae54ce52e83"`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ADD CONSTRAINT "FK_4e8635af932faaf46cfb3e5af19" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ADD CONSTRAINT "FK_8066d6197dfc7711ae54ce52e83" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner" DROP COLUMN "numberOfRates"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "numberOfRates"`);
    }

}
