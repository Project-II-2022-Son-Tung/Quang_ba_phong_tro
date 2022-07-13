import { IsNumber, IsPositive, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateOwnerRateInput{
    @Field()
    @IsPositive()
    @IsNumber()
    rate!: number;

    @Field()
    @IsString()
    comment!: string;

    @Field()
    @IsString()
    ownerId!: string;
    
}