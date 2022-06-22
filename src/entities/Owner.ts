import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from "typeorm"
import { Wallet } from "./Wallet"
import { Contract } from "./Contract";
import { OwnerRate } from "./OwnerRate";
import { Room } from "./Room";
import { Field, ID, ObjectType } from 'type-graphql'
import { Identification } from "./Identification";
import { OwnerHistory } from "./OwnerHistory";
import { Invite } from "./Invite";

@ObjectType()
@Entity()
export class Owner extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({unique: true})
    username!: string;

    @Field()
    @Column()
    fullName!: string;

    @Field()
    @Column()
    avatarUrl!: string;

    @Field()
    @Column({unique: true})
    email!: string;

    @Column({select: false})
    password!: string;

    @Field()
    @Column({nullable: true})
    rate: number;

    @Field()
    @Column({nullable: true})
    address: string;

    @Field(_type => ID)
    @Column("uuid")
    identificationId!: string;

    @Field()
    @OneToOne(() => Identification, {cascade: true})
    @JoinColumn({name: "identificationId"})
    identification: Identification;

    @Field()
    @Column()
    phoneNumber!: string;

    @Field(_type => Wallet)
    @OneToOne(() => Wallet, {cascade: true})
    @JoinColumn()
    wallet!: Wallet;

    @Field(_type => [OwnerRate], {nullable: true})
    @OneToMany(() => OwnerRate, (rate) => rate.owner)
    rates: OwnerRate[];

    @Field(_type => [Contract], {nullable: true})
    @OneToMany(() => Contract, (contract) => contract.owner)
    contracts: Contract[];

    @Field(_type => [OwnerHistory], {nullable: true})
    @OneToMany(() => OwnerHistory, (history) => history.owner)
    histories: OwnerHistory[];

    @Field(_type => [Invite], {nullable: true})
    @OneToMany(() => Invite, (invite) => invite.owner)
    invites: Invite[];

    @Field(_type => [Room], {nullable: true})
    @OneToMany(() => Room, (room) => room.owner)
    rooms: Room[];

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;


}
