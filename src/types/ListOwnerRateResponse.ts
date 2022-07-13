import { OwnerRate } from "../entities/OwnerRate";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ListOwnerRateResponse {
    @Field(() => [OwnerRate])
    ownerRates: OwnerRate[];

    @Field()
    totalPages: number;
}