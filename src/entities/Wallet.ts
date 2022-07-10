import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "./Transaction";

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
    @Column({type: "enum", enum: WalletStatus, default: WalletStatus.ACTIVE})
    status!: WalletStatus;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @Field(_type => [Transaction], { nullable: true })
    @OneToMany(() => Transaction, (transaction) => transaction.wallet, { cascade: true })
    transactions?: Transaction[];
}