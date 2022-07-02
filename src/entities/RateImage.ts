import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomRate } from "./RoomRate";

@ObjectType()
@Entity()
export class RateImage extends BaseEntity{
    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field(_type => RoomRate)
    @ManyToOne(() => RoomRate, (roomRate) => roomRate.images, { onDelete: "CASCADE" })
    @JoinColumn({ name: "rateId" })
    rate!: RoomRate;

    @Field()
    @Column()
    rateId!: string;

    @Field()
    @Column()
    imageUrl!: string;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}