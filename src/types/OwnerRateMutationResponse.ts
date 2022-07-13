import { OwnerRate } from "../entities/OwnerRate";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class OwnerRateMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    ownerRate?: OwnerRate;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}