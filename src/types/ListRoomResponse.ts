import { Room } from "../entities/Room";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ListRoomResponse {
    @Field(() => [Room])
    rooms: Room[];

    @Field()
    totalPages: number;
}