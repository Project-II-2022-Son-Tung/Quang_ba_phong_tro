import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFavourite1656506089410 implements MigrationInterface {
    name = 'UpdateFavourite1656506089410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "room_favourite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "roomId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_108489c9ae3e25a09a46b3e45f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "room_favourite" ADD CONSTRAINT "FK_9c1e2625e7af302e4200667b341" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_favourite" ADD CONSTRAINT "FK_daa05b6e2ed2a82c0f4057d5b1a" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room_favourite" DROP CONSTRAINT "FK_daa05b6e2ed2a82c0f4057d5b1a"`);
        await queryRunner.query(`ALTER TABLE "room_favourite" DROP CONSTRAINT "FK_9c1e2625e7af302e4200667b341"`);
        await queryRunner.query(`DROP TABLE "room_favourite"`);
    }

}
