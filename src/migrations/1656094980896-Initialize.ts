import { MigrationInterface, QueryRunner } from "typeorm";

export class Initialize1656094980896 implements MigrationInterface {
    name = 'Initialize1656094980896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "fullName" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_5e568e001f9d1b91f67815c580f" UNIQUE ("username"), CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "balance" integer NOT NULL, "availableBalance" integer NOT NULL, "status" "public"."wallet_status_enum" NOT NULL DEFAULT 'INACTIVE', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "identification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serial" character varying NOT NULL, "issueDate" TIMESTAMP NOT NULL, "issuedBy" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_44fbcfb27a8626b4bf4db0a222d" UNIQUE ("serial"), CONSTRAINT "PK_fd49f15a74f96c6d17645c8810a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timeOfCheck" TIMESTAMP NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, "userId" uuid, "roomId" uuid, CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying NOT NULL, "caption" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roomId" uuid, CONSTRAINT "PK_8c32b9db82405a0661e805694fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rate_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "rateId" uuid, CONSTRAINT "PK_e716d4ce083e3ba73050ee5a3ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" integer NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roomId" uuid, "userId" uuid, CONSTRAINT "PK_84aa230cb9172f4a4e7013e7502" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" integer, "address" character varying NOT NULL, "size" integer NOT NULL, "floor" integer NOT NULL, "description" character varying NOT NULL, "enclosed" boolean NOT NULL, "maxOccupancy" integer NOT NULL, "liveWithHost" boolean NOT NULL, "petsAllowed" boolean NOT NULL, "electricPrice" integer NOT NULL, "waterPrice" integer NOT NULL, "parking" boolean NOT NULL, "parkingFee" integer NOT NULL, "waterHeating" boolean NOT NULL, "airConditioning" boolean NOT NULL, "wifi" boolean NOT NULL, "wifiFee" integer NOT NULL, "lift" boolean NOT NULL, "numberOfFloors" integer NOT NULL, "available" boolean NOT NULL DEFAULT true, "price" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roomId" uuid, "userId" uuid, CONSTRAINT "PK_777252b9045d8011ab83c5b0834" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "fullName" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "identificationId" uuid NOT NULL, "address" character varying, "phoneNumber" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "walletId" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_7b196a1dd52b108dc7fb1887ca" UNIQUE ("identificationId"), CONSTRAINT "REL_922e8c1d396025973ec81e2a40" UNIQUE ("walletId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "owner_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rate" integer NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" uuid, "userId" uuid, CONSTRAINT "PK_38798d5d7d539ff5d6ce14c8bc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "owner_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roomId" uuid, "ownerId" uuid, CONSTRAINT "PK_92912f4a051738d33092405687c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "fullName" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "rate" integer, "address" character varying, "identificationId" uuid NOT NULL, "phoneNumber" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "walletId" uuid, CONSTRAINT "UQ_432373de5f77bd0786e7b912ad8" UNIQUE ("username"), CONSTRAINT "UQ_7431bbd2e694ee4a80c32bd7ef8" UNIQUE ("email"), CONSTRAINT "REL_e664381eeff40c64ec2ca24c83" UNIQUE ("identificationId"), CONSTRAINT "REL_d98490c8d75e81c87ee3ba0d2e" UNIQUE ("walletId"), CONSTRAINT "PK_8e86b6b9f94aece7d12d465dc0c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leasePrice" integer NOT NULL, "deposit" integer NOT NULL, "contractFee" integer NOT NULL, "address" character varying NOT NULL, "contractDuration" TIMESTAMP NOT NULL, "additionalAgreements" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "roomId" uuid, "ownerId" uuid, "userId" uuid, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_91bfeec7a9574f458e5b592472d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_ae6c12d5a549b2077ab9374ad4f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_image" ADD CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rate_image" ADD CONSTRAINT "FK_33eebda9f91f928bb6aab5115e6" FOREIGN KEY ("rateId") REFERENCES "room_rate"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_rate" ADD CONSTRAINT "FK_395f1384c7b934bf2b606975111" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room_rate" ADD CONSTRAINT "FK_b74666d9cf8f9cf2b96767ea211" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "room" ADD CONSTRAINT "FK_65283be59094a73fed31ffeee4e" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_history" ADD CONSTRAINT "FK_1825792b43b9d84bd8ba12bc65f" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_history" ADD CONSTRAINT "FK_1457ea6e3cbd29bf788292d0d15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_7b196a1dd52b108dc7fb1887caf" FOREIGN KEY ("identificationId") REFERENCES "identification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_922e8c1d396025973ec81e2a402" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ADD CONSTRAINT "FK_8066d6197dfc7711ae54ce52e83" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner_rate" ADD CONSTRAINT "FK_4e8635af932faaf46cfb3e5af19" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner_history" ADD CONSTRAINT "FK_f8d682128093e8237225aab4628" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner_history" ADD CONSTRAINT "FK_8ff11f6ec6732386a88ffc76489" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner" ADD CONSTRAINT "FK_e664381eeff40c64ec2ca24c834" FOREIGN KEY ("identificationId") REFERENCES "identification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "owner" ADD CONSTRAINT "FK_d98490c8d75e81c87ee3ba0d2e5" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_cf9839a50efcca56cff91d68852" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a45df5a99d61f11c78719bd6129" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_a45df5a99d61f11c78719bd6129"`);
        await queryRunner.query(`ALTER TABLE "contract" DROP CONSTRAINT "FK_cf9839a50efcca56cff91d68852"`);
        await queryRunner.query(`ALTER TABLE "owner" DROP CONSTRAINT "FK_d98490c8d75e81c87ee3ba0d2e5"`);
        await queryRunner.query(`ALTER TABLE "owner" DROP CONSTRAINT "FK_e664381eeff40c64ec2ca24c834"`);
        await queryRunner.query(`ALTER TABLE "owner_history" DROP CONSTRAINT "FK_8ff11f6ec6732386a88ffc76489"`);
        await queryRunner.query(`ALTER TABLE "owner_history" DROP CONSTRAINT "FK_f8d682128093e8237225aab4628"`);
        await queryRunner.query(`ALTER TABLE "owner_rate" DROP CONSTRAINT "FK_4e8635af932faaf46cfb3e5af19"`);
        await queryRunner.query(`ALTER TABLE "owner_rate" DROP CONSTRAINT "FK_8066d6197dfc7711ae54ce52e83"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_922e8c1d396025973ec81e2a402"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_7b196a1dd52b108dc7fb1887caf"`);
        await queryRunner.query(`ALTER TABLE "user_history" DROP CONSTRAINT "FK_1457ea6e3cbd29bf788292d0d15"`);
        await queryRunner.query(`ALTER TABLE "user_history" DROP CONSTRAINT "FK_1825792b43b9d84bd8ba12bc65f"`);
        await queryRunner.query(`ALTER TABLE "room" DROP CONSTRAINT "FK_65283be59094a73fed31ffeee4e"`);
        await queryRunner.query(`ALTER TABLE "room_rate" DROP CONSTRAINT "FK_b74666d9cf8f9cf2b96767ea211"`);
        await queryRunner.query(`ALTER TABLE "room_rate" DROP CONSTRAINT "FK_395f1384c7b934bf2b606975111"`);
        await queryRunner.query(`ALTER TABLE "rate_image" DROP CONSTRAINT "FK_33eebda9f91f928bb6aab5115e6"`);
        await queryRunner.query(`ALTER TABLE "room_image" DROP CONSTRAINT "FK_8652478a73dd49bbfcf14775e3e"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_ae6c12d5a549b2077ab9374ad4f"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_91bfeec7a9574f458e5b592472d"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_5a1d04aae4cb54ee4ad13f64ea0"`);
        await queryRunner.query(`DROP TABLE "contract"`);
        await queryRunner.query(`DROP TABLE "owner"`);
        await queryRunner.query(`DROP TABLE "owner_history"`);
        await queryRunner.query(`DROP TABLE "owner_rate"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_history"`);
        await queryRunner.query(`DROP TABLE "room"`);
        await queryRunner.query(`DROP TABLE "room_rate"`);
        await queryRunner.query(`DROP TABLE "rate_image"`);
        await queryRunner.query(`DROP TABLE "room_image"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "identification"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "admin"`);
    }

}
