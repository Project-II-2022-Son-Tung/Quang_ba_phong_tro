import { Wallet } from "../entities/Wallet";
import { Field, ObjectType } from "type-graphql";
import { IMutationResponse } from "./MutationResponse";
import { FieldError } from "./FieldError";

@ObjectType({implements: IMutationResponse})
export class WalletMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({nullable: true})
    wallet?: Wallet;

    @Field(_type => [FieldError], {nullable: true})
    errors?: FieldError[];
}