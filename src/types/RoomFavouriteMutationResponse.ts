import { RoomFavourite } from "../entities/RoomFavourite";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class RoomFavouriteMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    roomFavourite?: RoomFavourite;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}