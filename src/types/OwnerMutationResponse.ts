import { Owner } from "../entities/Owner";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class OwnerMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    owner?: Owner;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}