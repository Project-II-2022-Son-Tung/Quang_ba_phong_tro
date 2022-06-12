import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./Room";

@ObjectType()
@Entity()
export class RoomImage extends BaseEntity{
    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.images, { onDelete: "CASCADE" })
    @JoinColumn()
    room!: Room;

    @Field()
    @Column()
    imageUrl!: string;

    @Field()
    @Column()
    caption!: string;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}