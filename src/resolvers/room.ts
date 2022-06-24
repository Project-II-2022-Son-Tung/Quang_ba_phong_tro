import { Arg, Query, Resolver } from "type-graphql";
import { Room } from "../entities/Room";

@Resolver(_of => Room)
export class RoomResolver {
    @Query(_return => [Room])
    async rooms(): Promise<Room[]> {
        return await Room.find();
    }

    @Query(_return => Room, {nullable: true})
    async room(@Arg("id") id: string): Promise<Room | null> {
        return await Room.findOne(
            {
                where: {
                    id 
                }
            }
        );
    }
}