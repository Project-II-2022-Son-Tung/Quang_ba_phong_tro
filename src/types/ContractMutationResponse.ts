import { Contract } from "../entities/Contract";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class ContractMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    contract?: Contract;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}