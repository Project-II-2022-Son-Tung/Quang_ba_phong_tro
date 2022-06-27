import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contract } from "./Contract";
import { Districts } from "./Districts";
import { Invite } from "./Invite";
import { Owner } from "./Owner";
import { Provinces } from "./Provinces";
import { RoomImage } from "./RoomImage";
import { RoomRate } from "./RoomRate";
import { UserHistory } from "./UserHistory";
import { Wards } from "./Wards";

@ObjectType()
@Entity()
export class Room extends BaseEntity {

    @Field(_type => ID)
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Field()
    @Column({nullable: true})
    rate: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    address!: string;

    @Field()
    @Column()
    size!: number;

    @Field()
    @Column()
    floor!: number;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    enclosed!: boolean;

    @Field()
    @Column()
    maxOccupancy!: number;

    @Field()
    @Column()
    liveWithHost!: boolean;

    @Field()
    @Column()
    petsAllowed!: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    electricPrice?: number;

    @Field({nullable: true})
    @Column({nullable: true})
    waterPrice?: number;

    @Field()
    @Column()
    parking!: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    parkingFee?: number;

    @Field()
    @Column()
    waterHeating!: boolean;

    @Field()
    @Column()
    airConditioning!: boolean;

    @Field(_type => Provinces)
    @ManyToOne(() => Provinces, (province) => province.rooms)
    @JoinColumn()
    province!: Provinces;

    @Field(_type => Districts)
    @ManyToOne(() => Districts, (district) => district.rooms)
    @JoinColumn()
    district!: Districts;

    @Field(_type => Wards)
    @ManyToOne(() => Wards, (ward) => ward.rooms)
    @JoinColumn()
    ward!: Wards;

    @Field()
    @Column()
    wifi!: boolean;

    @Field({nullable: true})
    @Column({nullable: true})
    wifiFee?: number;

    @Field()
    @Column()
    lift!: boolean;

    @Field()
    @Column()
    numberOfFloors!: number;

    @Column({default: true})
    available!: boolean;

    @Column()
    price !: number;
    
    @Field(_type => [RoomImage])
    @OneToMany(() => RoomImage, (image) => image.room)
    images!: RoomImage[];

    @Field(_type => Owner)
    @ManyToOne(() => Owner, (owner) => owner.rooms, { onDelete: "CASCADE" })
    owner!: Owner;

    @Field(_type => [UserHistory])
    @OneToMany(() => UserHistory, (history) => history.room)
    histories: UserHistory[];

    @Field(_type => [RoomRate])
    @OneToMany(() => RoomRate, (rate) => rate.room)
    rates: RoomRate[];

    @Field(_type => [Invite])
    @OneToMany(() => Invite, (invite) => invite.room)
    invites: Invite[];
    
    @Field(_type => [Contract])
    @OneToMany(() => Contract, (contract) => contract.room)
    contracts: Contract[];

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

}