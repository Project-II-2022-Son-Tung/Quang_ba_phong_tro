import { Invite } from "../entities/Invite";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class InvitationMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    invite?: Invite;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}