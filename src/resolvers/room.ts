import { RoomMutationResponse } from "../types/RoomMutationResponse";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Room } from "../entities/Room";
import aws from "aws-sdk";

@Resolver(_of => Room)
export class RoomResolver {
    @Query(_return => [Room])
    async rooms(): Promise<Room[]> {
        return await Room.find();
    }

    @Query(_return => RoomMutationResponse, {nullable: true})
    async room(@Arg("id") id: string): Promise<RoomMutationResponse> {
        const room = await Room.findOne(
            {
                where: {
                    id 
                }
            }
        );
        if (!room) {
            return {
                code: 400,
                success: false,
                message: "Room not found"
            }
        }
        return {
            code: 200,
            success: true,
            room,
            message: "Successfully found room"
        }
    }

    // @Mutation(_return => RoomMutationResponse)
    // async createRoom(

    @Mutation(_return => String)
    async uploadImage(): Promise<String> {
        return "";
    }


}