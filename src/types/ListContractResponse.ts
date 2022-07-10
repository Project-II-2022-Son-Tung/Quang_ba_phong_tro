import { Contract } from "../entities/Contract";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ListContractResponse {
    @Field(() => [Contract])
    contracts: Contract[];

    @Field()
    totalPages: number;
}