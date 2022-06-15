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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRate = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const RateImage_1 = require("./RateImage");
const Room_1 = require("./Room");
const User_1 = require("./User");
let RoomRate = class RoomRate extends typeorm_1.BaseEntity {
    id;
    rate;
    comment;
    room;
    user;
    images;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], RoomRate.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoomRate.prototype, "rate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomRate.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Room_1.Room),
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, (room) => room.rates, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Room_1.Room)
], RoomRate.prototype, "room", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.rates, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], RoomRate.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [RateImage_1.RateImage]),
    (0, typeorm_1.OneToMany)(() => RateImage_1.RateImage, (image) => image.rate),
    __metadata("design:type", Array)
], RoomRate.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], RoomRate.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], RoomRate.prototype, "updatedAt", void 0);
RoomRate = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], RoomRate);
exports.RoomRate = RoomRate;
//# sourceMappingURL=RoomRate.js.map