import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Owner } from "./Owner";
import { User } from "./User";

@ObjectType()
@Entity()
export class OwnerRate extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column()
    rate!: number;

    @Field()
    @Column()
    comment!: string;

    @Field(_type=>Owner)
    @ManyToOne(() => Owner, (owner) => owner.rates, { onDelete: "CASCADE" })
    @JoinColumn()    
    owner!: Owner;

    @Field(_type=>User)
    @ManyToOne(() => User, (user) => user.rates, { onDelete: "CASCADE" })
    @JoinColumn()
    user!: User;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}