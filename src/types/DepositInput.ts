import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class DepositInput {

    @Field()
    @IsNumber()
    @IsPositive()
    amount: number

    @Field()
    @IsUUID()
    id: string

    @Field()
    @IsString()
    referenceId: string


}