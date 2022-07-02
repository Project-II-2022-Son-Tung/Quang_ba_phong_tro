import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRate1656753323193 implements MigrationInterface {
    name = 'UpdateRate1656753323193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rate_image" DROP CONSTRAINT "FK_33eebda9f91f928bb6aab5115e6"`);
        await queryRunner.query(`ALTER TABLE "rate_image" ALTER COLUMN "rateId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_rate" DROP CONSTRAINT "FK_395f1384c7b934bf2b606975111"`);
        await queryRunner.query(`ALTER TABLE "room_rate" DROP CONSTRAINT "FK_b74666d9cf8f9cf2b96767ea211"`);
        await queryRunner.query(`ALTER TABLE "room_rate" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_rate" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rate_image" ADD CONSTRAINT "FK_33eebda9f91f928bb6aab5115e6" FOREIGN KEY ("rateId") REFERENCES "room_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_rate" ADD CONSTRAINT "FK_395f1384c7b934bf2b606975111" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_rate" ADD CONSTRAINT "FK_b74666d9cf8f9cf2b96767ea211" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_rate" DROP CONSTRAINT "FK_b74666d9cf8f9cf2b96767ea211"`);
        await queryRunner.query(`ALTER TABLE "room_rate" DROP CONSTRAINT "FK_395f1384c7b934bf2b606975111"`);
        await queryRunner.query(`ALTER TABLE "rate_image" DROP CONSTRAINT "FK_33eebda9f91f928bb6aab5115e6"`);
        await queryRunner.query(`ALTER TABLE "room_rate" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_rate" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room_rate" ADD CONSTRAINT "FK_b74666d9cf8f9cf2b96767ea211" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_rate" ADD CONSTRAINT "FK_395f1384c7b934bf2b606975111" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate_image" ALTER COLUMN "rateId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rate_image" ADD CONSTRAINT "FK_33eebda9f91f928bb6aab5115e6" FOREIGN KEY ("rateId") REFERENCES "room_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
