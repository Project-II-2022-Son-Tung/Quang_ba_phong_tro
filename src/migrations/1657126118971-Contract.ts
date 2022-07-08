import { MigrationInterface, QueryRunner } from "typeorm";

export class Contract1657126118971 implements MigrationInterface {
    name = 'Contract1657126118971'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_cf9839a50efcca56cff91d68852"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "roomId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "ownerId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_cf9839a50efcca56cff91d68852" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_cf9839a50efcca56cff91d68852"`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "ownerId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "roomId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_cf9839a50efcca56cff91d68852" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
