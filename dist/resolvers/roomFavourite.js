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
exports.RoomFavouriteResolver = void 0;
const RoomFavourite_1 = require("../entities/RoomFavourite");
const type_graphql_1 = require("type-graphql");
const RoomFavouriteMutationResponse_1 = require("../types/RoomFavouriteMutationResponse");
const User_1 = require("../entities/User");
const Room_1 = require("../entities/Room");
let RoomFavouriteResolver = class RoomFavouriteResolver {
    async countRoomFavourites(roomId) {
        return await RoomFavourite_1.RoomFavourite.count({
            where: {
                roomId
            }
        });
    }
    async getUsersFavourited(roomId, ctx) {
        if ((!ctx.req.session.userId) || ctx.req.session.role !== 'owner') {
            return null;
        }
        const room = await Room_1.Room.findOne({
            where: {
                id: roomId
            },
            relations: ["owner"]
        });
        if ((!room) || room.owner.id !== ctx.req.session.userId) {
            return null;
        }
        const roomFavourites = await RoomFavourite_1.RoomFavourite.find({
            where: {
                roomId,
            },
        });
        console.log(roomFavourites);
        if (!roomFavourites || roomFavourites.length === 0) {
            return null;
        }
        let users = new Array();
        for (const roomFavourite of roomFavourites) {
            const user = await User_1.User.findOne({
                where: {
                    id: roomFavourite.userId,
                },
                relations: ["identification"]
            });
            if (user) {
                users.push(user);
            }
        }
        return users;
    }
    async isRoomFavourited(roomId, ctx) {
        const userId = ctx.req.session.userId;
        if ((!userId) || ctx.req.session.role !== 'user') {
            return false;
        }
        const user = await User_1.User.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            return false;
        }
        const roomFavourite = await RoomFavourite_1.RoomFavourite.findOne({
            where: {
                userId,
                roomId
            }
        });
        return !!roomFavourite;
    }
    async createRoomFavourite(roomId, ctx) {
        if ((!ctx.req.session.userId) || ctx.req.session.role !== 'user') {
            return {
                success: false,
                code: 400,
                message: "You are not authorized to create room favourite"
            };
        }
        const user = await User_1.User.findOne({
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
        const room = await Room_1.Room.findOne({
            where: {
                id: roomId
            }, relations: ["owner"]
        });
        if (!room) {
            return {
                code: 400,
                success: false,
                message: "Room not found",
            };
        }
        const roomFavourite = RoomFavourite_1.RoomFavourite.create({
            user,
            room,
        });
        await roomFavourite.save();
        return {
            code: 201,
            success: true,
            message: "Room are successfully added to favourites",
        };
    }
    async deleteRoomFavourite(roomId, ctx) {
        if ((!ctx.req.session.userId) || ctx.req.session.role !== 'user') {
            return {
                success: false,
                code: 400,
                message: "You are not authorized to delete room favourite"
            };
        }
        const roomFavourite = await RoomFavourite_1.RoomFavourite.findOne({
            where: {
                roomId,
                userId: ctx.req.session.userId,
            }, relations: ["room"]
        });
        if (!roomFavourite) {
            return {
                code: 400,
                success: false,
                message: "Room favourite not found",
            };
        }
        await roomFavourite.remove();
        return {
            code: 200,
            success: true,
            message: "Room are successfully removed from favourites",
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(_return => Number),
    __param(0, (0, type_graphql_1.Arg)("roomId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomFavouriteResolver.prototype, "countRoomFavourites", null);
__decorate([
    (0, type_graphql_1.Query)(_return => [User_1.User], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("roomId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomFavouriteResolver.prototype, "getUsersFavourited", null);
__decorate([
    (0, type_graphql_1.Query)(_return => Boolean),
    __param(0, (0, type_graphql_1.Arg)("roomId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomFavouriteResolver.prototype, "isRoomFavourited", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => RoomFavouriteMutationResponse_1.RoomFavouriteMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("roomId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomFavouriteResolver.prototype, "createRoomFavourite", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => RoomFavouriteMutationResponse_1.RoomFavouriteMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("roomId")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoomFavouriteResolver.prototype, "deleteRoomFavourite", null);
RoomFavouriteResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => RoomFavourite_1.RoomFavourite)
], RoomFavouriteResolver);
exports.RoomFavouriteResolver = RoomFavouriteResolver;
//# sourceMappingURL=roomFavourite.js.map