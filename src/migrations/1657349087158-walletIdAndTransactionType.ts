import { MigrationInterface, QueryRunner } from "typeorm";

export class walletIdAndTransactionType1657349087158 implements MigrationInterface {
    name = 'walletIdAndTransactionType1657349087158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_922e8c1d396025973ec81e2a402"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "walletId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner" DROP CONSTRAINT "FK_d98490c8d75e81c87ee3ba0d2e5"`);
        await queryRunner.query(`ALTER TABLE "owner" ALTER COLUMN "walletId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."contract_status_enum" AS ENUM('pending', 'succeeded', 'expired', 'canceled')`);
        await queryRunner.query(`ALTER TABLE "contract" ADD "status" "public"."contract_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_922e8c1d396025973ec81e2a402" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner" ADD CONSTRAINT "FK_d98490c8d75e81c87ee3ba0d2e5" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "owner" DROP CONSTRAINT "FK_d98490c8d75e81c87ee3ba0d2e5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_922e8c1d396025973ec81e2a402"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."contract_status_enum"`);
        await queryRunner.query(`ALTER TABLE "contract" ADD "status" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner" ALTER COLUMN "walletId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "owner" ADD CONSTRAINT "FK_d98490c8d75e81c87ee3ba0d2e5" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "walletId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_922e8c1d396025973ec81e2a402" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
