import { ListRoomRateResponse } from "../types/ListRoomRateResponse";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { RoomRate } from "../entities/RoomRate";
import { RoomRateMutationResponse } from "../types/RoomRateMutationResponse";
import { MyContext } from "../types/MyContext";
import { CreateRoomRateInput } from "../types/CreateRoomRateInput";
import { Invite, iStatus } from "../entities/Invite";
import { RateImage } from "../entities/RateImage";
import { UpdateRoomRateInput } from "../types/UpdateRoomRateInput";
import { deleteImage } from "../services/file-upload/provider/imageProvider";
import { Room } from "../entities/Room";

@Resolver(_of => RoomRate)
export class RoomRateResolver {

    @FieldResolver(_type => [RateImage])
    async images(@Root() roomRate: RoomRate): Promise<RateImage[]> {
        return await RateImage.find({
            where: {
                rateId : roomRate.id
            }
        });
    }
    
    @Query(_return => ListRoomRateResponse)
    async roomRates(
        @Arg("page") page: number,
        @Arg("limit") limit: number,
        @Arg("roomId") roomId: string
    ): Promise<ListRoomRateResponse> {
        const realLimit = Math.min(limit, 20);
        const roomRates = await RoomRate.find({
            where: { roomId },
            skip: (page - 1) * realLimit,
            take: realLimit,
            relations: ["user", "images"]
        });
        const total = await RoomRate.count();
        const totalPages = Math.ceil(total / realLimit);
        return {
            roomRates,
            totalPages,
        };
    }

    @Query(_return => RoomRate, { nullable: true })
    async myRoomRate(
        @Arg("roomId") roomId: string,
        @Ctx() ctx: MyContext
    ): Promise<RoomRate | null> {
        if( !ctx.req.session!.userId || ctx.req.session.role !== "user" ) {
            return null;
        }

        return await RoomRate.findOne({
            where: {
                roomId,
                userId: ctx.req.session!.userId,
            }
        });
    }

    @Mutation(_return => RoomRateMutationResponse)
    async createRoomRate(
        @Arg("rateInput") rateInput: CreateRoomRateInput,
        @Ctx() ctx: MyContext
    ): Promise<RoomRateMutationResponse> {
        if( !ctx.req.session!.userId || ctx.req.session.role !== "user" ) {
            return {
                code: 400,
                success: false,
                message: "You are not logged in"
            }
        }

        const room = await Room.findOne({
            where: {
                id: rateInput.roomId,
            }
        });

        if(!room) {
            return {
                code: 400,
                success: false,
                message: "Room does not exist"
            }
        }

        const invitation = await Invite.findOne({
            where: {
                roomId: rateInput.roomId,
                userId: ctx.req.session!.userId,
            }
        });

        if(!invitation || invitation.status !== iStatus.ACCEPTED) {
            return {
                code: 400,
                success: false,
                message: "You are not invited to this room"
            }
        }

        if(invitation.timeOfCheck > new Date()) {
            return {
                code: 400,
                success: false,
                message: "You can not rate this room yet"
            }
        }

        const existingRoomRate = await RoomRate.findOne({
            where: {
                roomId: rateInput.roomId,
                userId: ctx.req.session!.userId,
            }
        });

        if(existingRoomRate) {
            return {
                code: 400,
                success: false,
                message: "You have already rated this room, please update it"
            }
        }

        const connection = ctx.connection;
        return await connection.transaction(async transactionEntityManager =>{
            try {                
                const roomRate = await transactionEntityManager.create(RoomRate, {
                    rate: rateInput.rate,
                    roomId: rateInput.roomId,
                    comment: rateInput.comment,
                    userId: ctx.req.session!.userId,
                }).save();

                rateInput.images.forEach(async (image) => {
                    await transactionEntityManager.create(RateImage, {
                        imageUrl: image,
                        rate: roomRate,
                    }).save();
                });

                if(room.numberOfRates === 0) {
                    await transactionEntityManager.update(Room, room.id, {
                        rate: rateInput.rate,
                        numberOfRates: 1,
                    });
                } else {
                    const newRate = (room.rate * room.numberOfRates + rateInput.rate) / (room.numberOfRates + 1);
                    await transactionEntityManager.update(Room, room.id, {
                        rate: parseFloat((newRate).toFixed(2)),
                        numberOfRates: room.numberOfRates + 1,
                    });
                }
                
                return {
                    code: 200,
                    success: true,
                    message: "Successfully created room rate"
                }
            } catch (error) {
                return {
                    code: 400,
                    success: false,
                    message: "Failed to create room rate"
                }
            }
        });     

    }

    @Mutation(_return => RoomRateMutationResponse)
    async updateRoomRate(
        @Arg("rateInput") rateInput: UpdateRoomRateInput,
        @Ctx() ctx: MyContext
    ): Promise<RoomRateMutationResponse> {
        if( !ctx.req.session!.userId || ctx.req.session.role !== "user" ) {
            return {
                code: 400,
                success: false,
                message: "You are not logged in"
            }
        }

        const roomRate = await RoomRate.findOne({
            where: {
                id: rateInput.id,
                userId: ctx.req.session!.userId,
            }, relations: ["room"]
        });

        if(!roomRate) {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to update this room rate"
            }
        }

        if(!roomRate?.room) {
            return {
                code: 400,
                success: false,
                message: "Room does not exist"
            }
        }


        const connection = ctx.connection;
        return await connection.transaction(async transactionEntityManager =>{
            try {
                await transactionEntityManager.update(RoomRate, {
                    id: rateInput.id,
                }, {
                    rate: rateInput.rate ? rateInput.rate : roomRate.rate,
                    comment: rateInput.comment ? rateInput.comment : roomRate.comment,
                });
                if (rateInput.rate !== roomRate.rate) {
                    const avgRate = (await transactionEntityManager.createQueryBuilder()
                        .select("avg(rate)::numeric(10,2)")
                        .from(RoomRate, "roomRate")
                        .where("roomRate.roomId = :roomId", { roomId: roomRate.roomId })
                        .getRawOne()
                        );
                        
                    await transactionEntityManager.update(Room, {
                        id: roomRate.roomId,
                    }, {
                        rate: (avgRate["avg"])
                    });
                }
                if(rateInput.images) {
                    const existingImages = await transactionEntityManager.find(RateImage, {
                        where: {
                            rateId: rateInput.id,
                        }
                    });
                    const media_link = `https://${process.env.AWS_BUCKET_NAME || "quang-ba-phong-tro"}.s3.${process.env.AWS_BUCKET_REGION || "ap-southeast-1"}.amazonaws.com/`;
                    console.log(media_link);
                    existingImages.forEach(async (image) => {
                        if (image.imageUrl.startsWith(media_link)) {
                            const response = await deleteImage(image.imageUrl.replace(media_link, ""));
                            if (response[0]) {
                                throw new Error(response[0].message);
                            }
                        }
                        await transactionEntityManager.remove(image);
                    });
                    rateInput.images.forEach(async (image) => {
                        await transactionEntityManager.create(RateImage, {
                            imageUrl: image,
                            rate: roomRate,
                        }).save();
                    });
                }
                return {
                    code: 200,
                    success: true,
                    message: "Successfully updated room rate"
                }
            } catch (error) {
                return {
                    code: 400,
                    success: false,
                    message: "Failed to update room rate"
                }
            }
        });     

    }


    


}