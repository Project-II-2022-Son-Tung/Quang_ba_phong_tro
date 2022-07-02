"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomResolver = void 0;
const RoomMutationResponse_1 = require("../types/RoomMutationResponse");
const type_graphql_1 = require("type-graphql");
const Room_1 = require("../entities/Room");
const CreateRoomInput_1 = require("../types/CreateRoomInput");
const Wards_1 = require("../entities/Wards");
const Districts_1 = require("../entities/Districts");
const Provinces_1 = require("../entities/Provinces");
const RoomImage_1 = require("../entities/RoomImage");
const Owner_1 = require("../entities/Owner");
const RoomOrderByInput_1 = require("../types/RoomOrderByInput");
const typeorm_1 = require("typeorm");
const RoomFilterInput_1 = require("../types/RoomFilterInput");
const RoomFilterInput_2 = require("../types/RoomFilterInput");
const RoomRate_1 = require("../entities/RoomRate");
let RoomResolver = class RoomResolver {
    async images(room) {
        return await RoomImage_1.RoomImage.find({
            where: {
                roomId: room.id
            }
        });
    }
    async rooms(page, limit, orderBy, filter) {
        const realLimit = Math.min(limit, 20);
        let whereFilter = {};
        if (filter) {
            let key;
            for (key in filter) {
                if (filter[key] instanceof RoomFilterInput_1.FilterRange) {
                    const range = filter[key];
                    whereFilter = {
                        ...whereFilter,
                        [key]: (0, typeorm_1.Between)(range.min, range.max)
                    };
                }
                else if (filter[key] instanceof Array) {
                    whereFilter = {
                        ...whereFilter,
                        [key]: (0, typeorm_1.In)(filter[key])
                    };
                }
                else if (typeof filter[key] === "boolean") {
                    whereFilter = {
                        ...whereFilter,
                        [key]: filter[key]
                    };
                }
            }
            if (filter.search && filter.search.length > 0) {
                whereFilter = [{
                        ...whereFilter,
                        title: (0, typeorm_1.Like)(`%${filter.search}%`)
                    },
                    {
                        ...whereFilter,
                        address: (0, typeorm_1.Like)(`%${filter.search}%`)
                    },
                    {
                        ...whereFilter,
                        description: (0, typeorm_1.Like)(`%${filter.search}%`)
                    }];
            }
        }
        console.log(whereFilter);
        const rooms = await Room_1.Room.find({
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
    async room(id) {
        const room = await Room_1.Room.findOne({
            where: {
                id
            },
            relations: ["owner", "ward", "district", "province"]
        });
        if (!room) {
            return {
                code: 400,
                success: false,
                message: "Room not found"
            };
        }
        ;
        const rates = await RoomRate_1.RoomRate.find({
            where: {
                roomId: room.id
            }, relations: ["user"]
        });
        room.rates = rates;
        return {
            code: 200,
            success: true,
            room,
            message: "Successfully found room"
        };
    }
    async createRoom(roomInput, myContext) {
        if (myContext.req.session.role !== "owner") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to create room"
            };
        }
        const owner = await Owner_1.Owner.findOne({
            where: {
                id: myContext.req.session.userId
            }
        });
        if (!owner) {
            return {
                code: 400,
                success: false,
                message: "Your owner identification is not found"
            };
        }
        const connection = myContext.connection;
        return await connection.transaction(async (transactionEntityManager) => {
            try {
                const ward = await transactionEntityManager.findOne(Wards_1.Wards, {
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
                    };
                }
                const district = await transactionEntityManager.findOne(Districts_1.Districts, {
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
                    };
                }
                const province = await transactionEntityManager.findOne(Provinces_1.Provinces, {
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
                    };
                }
                const room = transactionEntityManager.create(Room_1.Room, {
                    ...roomInput,
                    owner,
                    ward,
                    district,
                    province,
                });
                await transactionEntityManager.save(room);
                roomInput.images.forEach(async (image) => {
                    const newImage = transactionEntityManager.create(RoomImage_1.RoomImage, {
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
                };
            }
            catch (error) {
                return {
                    code: 500,
                    success: false,
                    message: `Error creating room: ${error}`
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(_type => [RoomImage_1.RoomImage]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Room_1.Room]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "images", null);
__decorate([
    (0, type_graphql_1.Query)(_return => [Room_1.Room]),
    __param(0, (0, type_graphql_1.Arg)("page")),
    __param(1, (0, type_graphql_1.Arg)("limit")),
    __param(2, (0, type_graphql_1.Arg)("orderBy", { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)("filter", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, RoomOrderByInput_1.RoomOrderByInput,
        RoomFilterInput_2.RoomFilterInput]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "rooms", null);
__decorate([
    (0, type_graphql_1.Query)(_return => RoomMutationResponse_1.RoomMutationResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "room", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => RoomMutationResponse_1.RoomMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("roomInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRoomInput_1.CreateRoomInput, Object]),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "createRoom", null);
RoomResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => Room_1.Room)
], RoomResolver);
exports.RoomResolver = RoomResolver;
//# sourceMappingURL=room.js.map