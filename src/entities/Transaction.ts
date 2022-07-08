import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "./Admin";
import { Room } from "./Room";
import { Wallet } from "./Wallet";

export type TransactionDirection = "IN" | "OUT";
export type TransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type TransactionType = "INTERNAL" | "EXTERNAL";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    amount!: number;

    @Field()
    @Column()
    content!: string;

    @Field(_type => Wallet)
    @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "walletId" })
    wallet!: Wallet;

    @Field()
    @Column()
    walletId: string;

    @Field()
    @Column({ type: "enum", enum: ["IN", "OUT"], default: "IN" })
    direction!: TransactionDirection;

    @Field()
    @Column({ type: "enum", enum: ["PENDING", "COMPLETED", "CANCELLED"], default: "PENDING" })
    status!: TransactionStatus;

    @Field()
    @Column({ type: "enum", enum: ["INTERNAL", "EXTERNAL"], default: "INTERNAL" })
    type!: TransactionType;

    @Field({ nullable: true })
    @Column({ nullable: true })
    referenceId?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    roomId? : string;

    @Field(_type => Room, { nullable: true })
    @ManyToOne(() => Room, {nullable: true})
    @JoinColumn({ name: "roomId" })
    room?: Room;

    @Field({ nullable: true })
    @Column({ nullable: true })
    adminId?: string;

    @Field(_type => Admin, { nullable: true })
    @ManyToOne(() => Admin, {nullable: true})
    @JoinColumn({ name: "adminId" })
    admin?: Admin;
    
    @Field()
    @Column({ type: "timestamptz" })
    createdAt!: Date;
}

    


