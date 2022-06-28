import { Field, InputType } from "type-graphql";

export enum RoomOrderByInputEnum {
    DESC = "DESC",
    ASC = "ASC"
}

@InputType()
export class RoomOrderByInput {
    @Field({nullable: true})
    createdAt?: RoomOrderByInputEnum

    @Field({nullable: true})
    rate?: RoomOrderByInputEnum

    @Field({nullable: true})
    provinceCode?: RoomOrderByInputEnum

    @Field({nullable: true})
    price?: RoomOrderByInputEnum
}

