import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";
import { Field, ID, InputType } from "type-graphql";

@InputType()
export class UpdateRoomRateInput{

    @Field(_type => ID, { nullable: true })
    @IsOptional()
    @IsUUID()
    id!: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsPositive()
    @IsNumber()
    rate?: number;

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    comment?: string;

    @Field(_type => [String], { nullable: true })
    @IsOptional()
    @IsString({ each: true })
    images?: string[];
    
}