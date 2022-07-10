import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from "typeorm";
import { Contract } from "./Contract";
import { OwnerRate } from "./OwnerRate";
import {Field, ObjectType, ID} from "type-graphql";
import {Identification} from "./Identification";
import { UserHistory } from "./UserHistory";
import { Invite } from "./Invite";
import { Wallet } from "./Wallet";
import { RoomFavourite } from "./RoomFavourite";

@ObjectType()
@Entity()
export class User extends BaseEntity {

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

    @Field(_type => ID)
    @Column("uuid")
    identificationId!: string;

    @Field()
    @OneToOne(() => Identification, {cascade: true})
    @JoinColumn({name: "identificationId"})
    identification: Identification;

    @Field()
    @Column({nullable: true})
    address: string;

    @Field()
    @Column()
    phoneNumber!: string;

    @Field(_type=>Wallet)
    @OneToOne(() => Wallet, {cascade: true})
    @JoinColumn()
    wallet!: Wallet;

    @Field()
    @Column()
    walletId!: string;

    @Field(_type => [OwnerRate], {nullable: true})
    @OneToMany(() => OwnerRate, (rate) => rate.user)
    rates: OwnerRate[];

    @Field(_type => [Contract], {nullable: true})
    @OneToMany(() => Contract, (contract) => contract.user)
    contracts: Contract[];

    @Field(_type => [Invite], {nullable: true})
    @OneToMany(() => Invite, (invite) => invite.user)
    invites: Invite[];

    @Field(_type => [RoomFavourite], {nullable: true})
    @OneToMany(() => RoomFavourite, (favourite) => favourite.user)
    roomFavourites: RoomFavourite[];
    
    @Field(_type => [UserHistory], {nullable: true})
    @OneToMany(() => UserHistory, (history) => history.user)
    histories: UserHistory[];

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;


}
