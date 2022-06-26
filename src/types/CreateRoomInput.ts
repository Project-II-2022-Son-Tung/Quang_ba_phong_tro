import { Field, InputType } from "type-graphql";

@InputType()
export class CreateRoomInput {

    @Field()
    street!: string;

    @Field()
    district!: string;

    @Field()
    city!: string;

    @Field()
    address!: string;

    @Field()
    size!: number;

    @Field()
    floor!: number;

    @Field()
    description!: string;

    @Field()
    enclosed!: boolean;

    @Field()
    maxOccupancy!: number;

    @Field()
    liveWithHost!: boolean;

    @Field()
    petsAllowed!: boolean;

    @Field()
    electricPrice!: number;

    @Field()
    waterPrice!: number;

    @Field()
    parking!: boolean;

    @Field()
    parkingFee!: number;

    @Field()
    waterHeating!: boolean;

    @Field()
    airConditioning!: boolean;

    @Field()
    wifi!: boolean;

    @Field()
    wifiFee!: number;

    @Field()
    lift!: boolean;

    @Field()
    numberOfFloors!: number;

    @Field()
    price!: number;


}