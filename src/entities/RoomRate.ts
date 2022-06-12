import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RateImage } from "./RateImage";
import { Room } from "./Room";
import { User } from "./User";

@ObjectType()
@Entity()
export class RoomRate extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    rate!: number;

    @Field()
    @Column()
    comment!: string;

    @Field(_type => Room)
    @ManyToOne(() => Room, (room) => room.rates, { onDelete: "CASCADE" })
    @JoinColumn()    
    room!: Room;

    @Field(_type => User)
    @ManyToOne(() => User, (user) => user.rates, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User;

    @Field()
    @OneToMany(()=> RateImage, (image) => image.rate)
    images!: RateImage[];

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}