import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Admin } from "./Admin";
import { Room } from "./Room";
import { Wallet } from "./Wallet";

export enum TransactionDirectionEnum {
    IN = "IN",
    OUT = "OUT"
}
export enum TransactionStatusEnum {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export enum TransactionTypeEnum {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL"
}

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
    @Column({ type: "enum", enum: TransactionDirectionEnum, default: TransactionDirectionEnum.IN })
    direction!: TransactionDirectionEnum;

    @Field()
    @Column({ type: "enum", enum: TransactionStatusEnum, default: TransactionStatusEnum.PENDING })
    status!: TransactionStatusEnum;

    @Field()
    @Column({ type: "enum", enum: TransactionTypeEnum, default: TransactionTypeEnum.INTERNAL })
    type!: TransactionTypeEnum;

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
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}

    


