import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvite1656747766021 implements MigrationInterface {
    name = 'UpdateInvite1656747766021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_91bfeec7a9574f458e5b592472d"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_ae6c12d5a549b2077ab9374ad4f"`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "timeOfCheck"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD "timeOfCheck" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."invite_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "invite" ADD "status" "public"."invite_status_enum" NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_91bfeec7a9574f458e5b592472d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_ae6c12d5a549b2077ab9374ad4f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_ae6c12d5a549b2077ab9374ad4f"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_91bfeec7a9574f458e5b592472d"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0"`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."invite_status_enum"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" DROP COLUMN "timeOfCheck"`);
        await queryRunner.query(`ALTER TABLE "invite" ADD "timeOfCheck" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_ae6c12d5a549b2077ab9374ad4f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_91bfeec7a9574f458e5b592472d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
