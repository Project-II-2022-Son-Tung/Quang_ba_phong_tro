import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { User} from "./User";

export type uHStatus = "viewed" | "checked" | "leased" | "extended" ;
@ObjectType()
@Entity()
export class UserHistory extends BaseEntity{
    @Field(_type=>ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.histories)
    @JoinColumn()
    room!: Room;

    @Field(_type => User)
    @ManyToOne(() => User, (user) => user.histories)
    @JoinColumn()
    user!: User;

    @Field()
    @Column()
    type!: uHStatus;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}