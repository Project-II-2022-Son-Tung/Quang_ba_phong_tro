import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./Owner";
import { Room } from "./Room";
import { User } from "./User";

export enum iStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED"
}


@ObjectType()
@Entity()
export class Invite extends BaseEntity{
    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => Owner)
    @ManyToOne(() => Owner, (owner) => owner.invites)
    @JoinColumn({ name: "ownerId" })
    owner!: Owner;

    @Field()
    @Column()
    ownerId!: string;

    @Field(_type => User)
    @ManyToOne(() => User, (user) => user.invites)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Field()
    @Column()
    userId!: string;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.invites)
    @JoinColumn({ name: "roomId" })
    room!: Room;

    @Field()
    @Column()
    roomId!: string;

    @Field()
    @Column({ type: "timestamptz" })
    timeOfCheck!: Date;

    @Field()
    @Column({
            type: "enum",
            enum: iStatus,
            default: iStatus.PENDING
        })
    status!: iStatus;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}