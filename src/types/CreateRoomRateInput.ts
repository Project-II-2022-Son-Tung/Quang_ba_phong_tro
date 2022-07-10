import { IsNumber, IsPositive, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateRoomRateInput{
    @Field()
    @IsPositive()
    @IsNumber()
    rate!: number;

    @Field()
    @IsString()
    comment!: string;

    @Field()
    @IsString()
    roomId!: string;

    @Field(_type => [String])
    @IsString({ each: true })
    images!: string[];
    
}