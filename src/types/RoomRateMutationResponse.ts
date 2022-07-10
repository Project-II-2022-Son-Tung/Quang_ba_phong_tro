import { RoomRate } from "../entities/RoomRate";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class RoomRateMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    roomRate?: RoomRate;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}