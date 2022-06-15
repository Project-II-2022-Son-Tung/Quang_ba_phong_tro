import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum WalletStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    LOCKED = "LOCKED"
}

@ObjectType()
@Entity()
export class Wallet extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    balance!: number;

    @Field()
    @Column()
    availableBalance!: number;

    @Field(_type => String)
    @Column({type: "enum", enum: WalletStatus, default: WalletStatus.INACTIVE})
    status!: WalletStatus;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}