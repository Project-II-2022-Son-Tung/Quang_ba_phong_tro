import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, PrimaryColumn } from "typeorm";
import { Districts } from "./Districts";

@ObjectType()
@Entity()
export class Wards extends BaseEntity {

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
    district_code: string;

    @Field(_type => Districts)
    @ManyToMany(() => Districts, (district) => district.wards, { onDelete: "CASCADE" })
    @JoinColumn({ name: "district_code" })
    district!: Districts;
    
    @Field(_type => Int, {nullable: true})
    @Column({ nullable: true})
    administrative_unit_id?: number;

}