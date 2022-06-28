import { Field, InputType } from "type-graphql";

@InputType()
export class FilterRange {
    @Field({nullable: true})
    min?: number;

    @Field({nullable: true})
    max: number;
}


@InputType()
export class RoomFilterInput {
    @Field(_type => FilterRange, {nullable: true})
    price? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    size? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    floor? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    maxOccupancy? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    electricPrice? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    waterPrice? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    parkingFee? : FilterRange;

    @Field(_type => FilterRange, {nullable: true})
    numberOfFloors ? : FilterRange;

    @Field({nullable: true})
    lift? : boolean;

    @Field({nullable: true})
    wifi? : boolean;

    @Field({nullable: true})
    petAllowed? : boolean;

    @Field({nullable: true})
    airConditioning? : boolean;

    @Field({nullable: true})
    waterHeating? : boolean;

    @Field({nullable: true})
    parking? : boolean;

    @Field({nullable: true})
    enclosed? : boolean;

    @Field({nullable: true})
    liveWithHost? : boolean;

    @Field(_type => [String] ,{nullable: true})
    provinceCode? : string[];

    @Field(_type => [String] ,{nullable: true})
    districtCode? : string[];

    @Field(_type => [String] ,{nullable: true})
    wardCode? : string[];

    @Field({nullable: true})
    search? : string;

}

