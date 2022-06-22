import { Admin } from "../entities/Admin";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class AdminMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    admin?: Admin;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}