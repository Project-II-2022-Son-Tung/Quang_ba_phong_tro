import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@ObjectType()
@Entity()
export class RoomFavourite extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => User)
    @ManyToOne(() => User, (user) => user.roomFavourites, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @Field()
    @Column()
    userId: string;

    @Field(_type => Room)
    @ManyToOne(() => Room, { onDelete: "CASCADE" })
    @JoinColumn({ name: "roomId" })
    room!: Room;

    @Field()
    @Column()
    roomId: string;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}