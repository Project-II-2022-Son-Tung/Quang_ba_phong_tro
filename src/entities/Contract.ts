import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Owner } from "./Owner";
import { Room } from "./Room";
import { User } from "./User";

export enum StatusContractEnum {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    EXPIRED = "expired",
    CANCELED = "canceled"
}


@ObjectType()
@Entity()
export class Contract extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    leasePrice!: number;

    @Field()
    @Column()
    deposit!: number;

    @Field()
    @Column()
    contractFee!: number;

    @Field()
    @Column()
    address!: string;

    @Field()
    @Column()
    contractDuration!: Date;

    @Field()
    @Column()
    additionalAgreements!: string;

    @Field()
    @Column(
        {
            type: "enum",
            enum: StatusContractEnum,
            default: StatusContractEnum.PENDING
        }
    )
    status!: StatusContractEnum;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.contracts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "roomId"})    
    room!: Room;

    @Field()
    @Column()
    roomId: string;

    @Field(_type => Owner)
    @ManyToOne(() => Owner, (owner) => owner.contracts, { onDelete: "CASCADE" })
    @JoinColumn({name: "ownerId"})    
    owner!: Owner;

    @Field()
    @Column()
    ownerId: string;

    @Field(_type => User)
    @ManyToOne(() => User, (user) => user.contracts, { onDelete: "CASCADE" })
    @JoinColumn({name: "userId"})
    user!: User;

    @Field()
    @Column()
    userId: string;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}