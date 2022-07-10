import { IsNumber, IsPositive, IsString, IsUUID } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class UpdateRoomRateInput{

    @Field(_type => ID)
    @IsUUID()
    id!: string;

    @Field()
    @IsPositive()
    @IsNumber()
    rate!: number;

    @Field()
    @IsString()
    comment!: string;

    @Field(_type => [String])
    @IsString({ each: true })
    images!: string[];
    
}