import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./Owner";
import { Room } from "./Room";
import { User } from "./User";

export type iStatus = "pending" | "accepted" | "rejected";

@ObjectType()
@Entity()
export class Invite extends BaseEntity{
    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => Owner)
    @ManyToOne(() => Owner, (owner) => owner.invites)
    @JoinColumn()
    owner!: Owner;

    @Field(_type => User)
    @ManyToOne(() => User, (user) => user.invites)
    @JoinColumn()
    user!: User;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.invites)
    @JoinColumn()
    room!: Room;

    @Field()
    @Column()
    timeOfCheck!: Date;

    @Field()
    @Column()
    status!: iStatus;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}