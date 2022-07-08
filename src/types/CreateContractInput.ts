import { IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateContractInput {

    @Field()
    @IsString()
    userId!: string;

    @Field()
    @IsString()
    roomId!: string;

    @Field()
    @Min(1)
    contractMonths!: ContractMonthsDuration;

    @Field()
    @Min(0)
    deposit!: number;

    @Field()
    @MinLength(10)
    @MaxLength(1000)
    additionalAgreements!: string;

    @Field({nullable: true})
    @IsOptional()
    @Min(0)
    leasePrice?: number;

    @Field()
    @IsString()
    detailAddress!: string;

}

export type ContractMonthsDuration = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;