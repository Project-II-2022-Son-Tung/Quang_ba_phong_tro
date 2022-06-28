import { RoomMutationResponse } from "../types/RoomMutationResponse";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { Room } from "../entities/Room";
import { CreateRoomInput } from "../types/CreateRoomInput";
import { MyContext } from "../types/MyContext";
import { Wards } from "../entities/Wards";
import { Districts } from "../entities/Districts";
import { Provinces } from "../entities/Provinces";
import { RoomImage } from "../entities/RoomImage";
import { Owner } from "../entities/Owner";
import { RoomOrderByInput } from "../types/RoomOrderByInput";
import { Between, FindOptionsWhere, In, Like } from "typeorm";
import { FilterRange} from "../types/RoomFilterInput";
import { RoomFilterInput } from "../types/RoomFilterInput";

@Resolver(_of => Room)
export class RoomResolver {
    @FieldResolver(_type => [RoomImage])
    async images(@Root() room: Room): Promise<RoomImage[]> {
        return await RoomImage.find({
            where: {
                roomId : room.id
            }
        });
    }


    @Query(_return => [Room])
    async rooms(
        @Arg("page") page: number,
        @Arg("limit") limit: number,
        @Arg("orderBy", {nullable: true}) orderBy?: RoomOrderByInput,
        @Arg("filter", {nullable: true}) filter?: RoomFilterInput,
    ): Promise<Room[]> {
        const realLimit = Math.min(limit, 20);
        let whereFilter: FindOptionsWhere<Room> | FindOptionsWhere<Room>[] = {};
        if (filter) {
            let key: keyof RoomFilterInput;
            for (key in filter) {
                if (filter[key] instanceof FilterRange) {
                    const range: FilterRange = filter[key] as FilterRange;
                    whereFilter = {
                        ...whereFilter,
                        [key]: Between(range.min, range.max)
                    }
                }
                else if (filter[key] instanceof Array) {
                    whereFilter = {
                        ...whereFilter,
                        [key]: In(filter[key] as string[])
                    }
                }
                else if (typeof filter[key] === "boolean") {
                    whereFilter = {
                        ...whereFilter,
                        [key]: filter[key] as Boolean
                    }
                }
            }
            if (filter.search && filter.search.length > 0) {
                whereFilter = [{
                    ...whereFilter,
                    title: Like(`%${filter.search}%`)
                },
                {
                    ...whereFilter,
                    address: Like(`%${filter.search}%`)
                },
                {
                    ...whereFilter,
                    description: Like(`%${filter.search}%`)
                }]
            }
        }
        console.log(whereFilter);
        const rooms = await Room.find({
            where: whereFilter,
            skip: (page - 1) * realLimit,
            take: realLimit,
            relations: ["owner", "ward", "district", "province"],
            order: orderBy ? orderBy : {
                 createdAt: "DESC"
            }
        });
        return rooms;
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

    @Mutation(_return => RoomMutationResponse)
    async createRoom(
        @Arg("roomInput") roomInput: CreateRoomInput,
        @Ctx() myContext: MyContext
    ): Promise<RoomMutationResponse> {
        if(myContext.req.session.role !== "owner") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to create room"
            }
        }
        const owner = await Owner.findOne(
            {
                where: {
                    id: myContext.req.session!.userId
                }
            }
        );
        if (!owner) {
            return {
                code: 400,
                success: false,
                message: "Your owner identification is not found"
            }
        }
        const connection = myContext.connection;
        return await connection.transaction(async transactionEntityManager =>{
            try {
                const ward = await transactionEntityManager.findOne(Wards, {
                    where: {
                        code: roomInput.ward
                    }
                });
                if (!ward) {
                    return {
                        code: 400,
                        success: false,
                        message: "Ward not valid",
                        errors: [
                            {
                                field: "ward",
                                message: "Ward not valid"
                            }
                        ]
                    }
                }
                const district = await transactionEntityManager.findOne(Districts, {
                    where: {
                        code: roomInput.district
                    }
                });

                if ((!district) || (district.code !== ward.district_code)) {
                    return {
                        code: 400,
                        success: false,
                        message: "District not valid",
                        errors: [
                            {
                                field: "district",
                                message: "District not valid"
                            }
                        ]
                    }
                }

                const province = await transactionEntityManager.findOne(Provinces, {
                    where: {
                        code: roomInput.province
                    }
                });


                if ((!province) || (province.code !== district.province_code)) {
                    return {
                        code: 400,
                        success: false,
                        message: "Province not valid",
                        errors: [
                            {
                                field: "province",
                                message: "Province not valid"
                            }
                        ]
                        
                    }
                }

                const room = transactionEntityManager.create(Room, {
                    ...roomInput,
                    owner,
                    ward,
                    district,
                    province,
                });
                await transactionEntityManager.save(room);

                roomInput.images.forEach(async image => {
                    const newImage = transactionEntityManager.create(RoomImage, {
                        imageUrl: image.fileUrl,
                        caption: image.caption,
                        room
                    });
                    await transactionEntityManager.save(newImage);
                });

                
                return {
                    code: 200,
                    success: true,
                    message: "Successfully created room",
                    room
                }
            } catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: `Error creating room: ${error}`
                }
            }
        });
    }



}