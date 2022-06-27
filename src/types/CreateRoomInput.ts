import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateRoomInput {

    @Field()
    @IsString()
    ward!: string;

    @Field()
    @IsString()
    title!: string;

    @Field()
    @IsString()
    district!: string;

    @Field()
    @IsString()
    province!: string;

    @Field()
    @MinLength(10)
    @MaxLength(1000)
    address!: string;

    @Field()
    @IsPositive()
    @IsNumber()
    size!: number;

    @Field()
    @IsNumber()
    floor!: number;

    @Field()
    @MinLength(10)
    description!: string;

    @Field()
    @IsBoolean()
    enclosed!: boolean;

    @Field()
    @IsPositive()
    @IsNumber()
    maxOccupancy!: number;

    @Field()
    @IsBoolean()
    liveWithHost!: boolean;

    @Field()
    @IsBoolean()
    petsAllowed!: boolean;

    @Field({nullable: true})
    @IsPositive()
    @IsNumber()
    electricPrice?: number;

    @Field({nullable: true})
    @IsPositive()
    @IsNumber()
    @IsOptional()
    waterPrice?: number;

    @Field()
    parking!: boolean;

    @Field({nullable: true})
    @IsPositive()
    @IsNumber()
    @IsOptional()
    parkingFee?: number;

    @Field()
    waterHeating!: boolean;

    @Field()
    airConditioning!: boolean;

    @Field()
    wifi!: boolean;

    @Field({nullable: true})
    @IsNumber()
    @IsPositive()
    @IsOptional()
    wifiFee?: number;

    @Field()
    lift!: boolean;

    @Field()
    numberOfFloors!: number;

    @Field()
    price!: number;

    @Field(_type => [RoomImageInput])
    images!: RoomImageInput[];



}

@InputType()
export class RoomImageInput {
    @Field()
    fileUrl!: string;

    @Field()
    @IsString()
    @MaxLength(50)
    caption!: string;
}