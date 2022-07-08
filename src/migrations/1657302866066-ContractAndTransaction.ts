import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractAndTransaction1657302866066 implements MigrationInterface {
    name = 'ContractAndTransaction1657302866066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_direction_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('INTERNAL', 'EXTERNAL')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "content" character varying NOT NULL, "walletId" uuid NOT NULL, "direction" "public"."transaction_direction_enum" NOT NULL DEFAULT 'IN', "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'PENDING', "type" "public"."transaction_type_enum" NOT NULL DEFAULT 'INTERNAL', "referenceId" character varying, "roomId" uuid, "adminId" uuid, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_cf9839a50efcca56cff91d68852"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_633838dc548da11a70812bac219" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_f65be377f17356a4b2e5aad5f8f" FOREIGN KEY ("adminId") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_cf9839a50efcca56cff91d68852" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_cf9839a50efcca56cff91d68852"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_f65be377f17356a4b2e5aad5f8f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_633838dc548da11a70812bac219"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_cf9839a50efcca56cff91d68852" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_direction_enum"`);
    }

}
