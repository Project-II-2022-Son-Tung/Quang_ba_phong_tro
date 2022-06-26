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
let RoomResolver = class RoomResolver {
    async rooms() {
        return await Room_1.Room.find();
    }
    async room(id) {
        const room = await Room_1.Room.findOne({
            where: {
                id
            }
        });
        if (!room) {
            return {
                code: 400,
                success: false,
                message: "Room not found"
            };
        }
        return {
            code: 200,
            success: true,
            room,
            message: "Successfully found room"
        };
    }
    async uploadImage() {
        return "";
    }
};
__decorate([
    (0, type_graphql_1.Query)(_return => [Room_1.Room]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    (0, type_graphql_1.Mutation)(_return => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoomResolver.prototype, "uploadImage", null);
RoomResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => Room_1.Room)
], RoomResolver);
exports.RoomResolver = RoomResolver;
//# sourceMappingURL=room.js.map