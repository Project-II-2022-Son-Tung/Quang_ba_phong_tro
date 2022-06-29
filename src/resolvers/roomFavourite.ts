import { RoomFavourite } from "../entities/RoomFavourite";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { RoomFavouriteMutationResponse } from "../types/RoomFavouriteMutationResponse";
import { MyContext } from "../types/MyContext";
import { User } from "../entities/User";
import { Room } from "../entities/Room";

@Resolver(_of => RoomFavourite)
export class RoomFavouriteResolver {
    @Query(_return => Number)
    async countRoomFavourites(
        @Arg("roomId") roomId: string,
    ): Promise<number> {
        return await RoomFavourite.count(
            {
                where: {
                    roomId
                }
            }
        );
    }

    @Query(_return => Boolean)
    async isRoomFavourited(
        @Arg("roomId") roomId: string,
        @Ctx() ctx: MyContext
    ): Promise<boolean> {
        const userId = ctx.req.session!.userId;
        if ((!userId) || ctx.req.session.role !== 'user') {
            return false;
        }
        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            return false;
        }
        const roomFavourite = await RoomFavourite.findOne(
            {
                where: {
                    userId,
                    roomId
                }
            }
        );
        return !!roomFavourite;
    }

    @Mutation(_return => RoomFavouriteMutationResponse)
    async createRoomFavourite(
        @Arg("roomId") roomId: string,
        @Ctx() ctx: MyContext
    ): Promise<RoomFavouriteMutationResponse> {
        if((!ctx.req.session.userId) || ctx.req.session.role !== 'user') {
            return {
                success: false,
                code: 400,
                message: "You are not authorized to create room favourite"
            }
        }
        const user = await User.findOne({
            where: {
                id: ctx.req.session.userId
            }
        });
        if (!user) {
            return {
                code: 400,
                success: false,
                message: "User not found",
            };
        }
        const room = await Room.findOne({
            where: {
                id: roomId
            }
        });
        if (!room) {
            return {
                code: 400,
                success: false,
                message: "Room not found",
            };
        }

        const roomFavourite = RoomFavourite.create({
            user,
            room,
        });
        return {
            code: 201,
            success: true,
            message: "Room are successfully added to favourites",
            roomFavourite: await roomFavourite.save(),
        }
    }

    @Mutation(_return => RoomFavouriteMutationResponse)
    async deleteRoomFavourite(
        @Arg("id") id: string,
        @Ctx() ctx: MyContext
    ): Promise<RoomFavouriteMutationResponse> {
        if((!ctx.req.session.userId) || ctx.req.session.role !== 'user') {
            return {
                success: false,
                code: 400,
                message: "You are not authorized to delete room favourite"
            }
        }
        const roomFavourite = await RoomFavourite.findOne({
            where: {
                id,
                userId: ctx.req.session.userId,
            },
        });
        if (!roomFavourite) {
            return {
                code: 400,
                success: false,
                message: "Room favourite not found",
            }
        }
        await roomFavourite.remove();
        return {
            code: 200,
            success: true,
            message: "Room are successfully removed from favourites",
        };
    }



}