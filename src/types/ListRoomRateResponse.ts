import { RoomRate } from "../entities/RoomRate";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ListRoomRateResponse {
    @Field(() => [RoomRate])
    roomRates: RoomRate[];

    @Field()
    totalPages: number;
}