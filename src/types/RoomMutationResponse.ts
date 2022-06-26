import { Room } from "../entities/Room";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class RoomMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    room?: Room;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}