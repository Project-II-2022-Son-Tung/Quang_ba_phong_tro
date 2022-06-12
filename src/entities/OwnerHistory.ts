import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Owner } from "./Owner";
import { Room } from "./Room";

export type oHStatus = "posted" | "updated" | "closed" | "leased";
@ObjectType()
@Entity()
export class OwnerHistory extends BaseEntity {
    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.histories)
    @JoinColumn()
    room!: Room;

    @Field(_type => Owner)
    @ManyToOne(() => Owner, (owner) => owner.histories)
    @JoinColumn()
    owner!: Owner;

    @Field()
    @Column()
    type!: oHStatus;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}