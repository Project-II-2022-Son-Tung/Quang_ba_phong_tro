import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Provinces } from "./Provinces";
import { Room } from "./Room";
import { Wards } from "./Wards";

@ObjectType()
@Entity()
export class Districts extends BaseEntity {

    @Field(_type => String)
    @PrimaryColumn({ length: 20})
    code!: string;

    @Field(_type => String)
    @Column({ length: 255})
    name!: string;

    @Field(_type => String)
    @Column({ length: 255})
    name_en: string;

    @Field(_type => String, {nullable: true})
    @Column({ length: 255, nullable: true})
    full_name?: string;

    @Field(_type => String, {nullable: true})
    @Column({ length: 255, nullable: true})
    full_name_en?: string;

    @Field(_type => String, {nullable: true})
    @Column({ length: 255, nullable: true})
    code_name?: string;

    @Field(_type => String)
    @Column({ length: 20})
    province_code: string;

    @Field(_type => Provinces)
    @ManyToMany(() => Provinces, (province) => province.districts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "province_code" })
    province!: Provinces;

    @Field(_type => [Room])
    @OneToMany(() => Room, (room) => room.district)
    rooms: Room[];
    
    @Field(_type => [Wards])
    @OneToMany(() => Wards, (ward) => ward.district, { cascade: true })
    wards: Wards[];

    @Field(_type => Int, {nullable: true})
    @Column({ nullable: true})
    administrative_unit_id?: number;

}