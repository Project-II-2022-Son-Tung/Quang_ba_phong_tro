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
exports.Room = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Contract_1 = require("./Contract");
const Invite_1 = require("./Invite");
const Owner_1 = require("./Owner");
const RoomImage_1 = require("./RoomImage");
const RoomRate_1 = require("./RoomRate");
const UserHistory_1 = require("./UserHistory");
let Room = class Room extends typeorm_1.BaseEntity {
    id;
    rate;
    address;
    size;
    floor;
    description;
    enclosed;
    maxOccupancy;
    liveWithHost;
    petsAllowed;
    electricPrice;
    waterPrice;
    parking;
    parkingFee;
    waterHeating;
    airConditioning;
    wifi;
    wifiFee;
    lift;
    numberOfFloors;
    available;
    price;
    images;
    owner;
    histories;
    rates;
    invites;
    contracts;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Room.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Room.prototype, "rate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "floor", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Room.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "enclosed", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "maxOccupancy", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "liveWithHost", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "petsAllowed", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "electricPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "waterPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "parking", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "parkingFee", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "waterHeating", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "airConditioning", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "wifi", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "wifiFee", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Room.prototype, "lift", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "numberOfFloors", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Room.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Room.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [RoomImage_1.RoomImage]),
    (0, typeorm_1.OneToMany)(() => RoomImage_1.RoomImage, (image) => image.room),
    __metadata("design:type", Array)
], Room.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Owner_1.Owner),
    (0, typeorm_1.ManyToOne)(() => Owner_1.Owner, (owner) => owner.rooms, { onDelete: "CASCADE" }),
    __metadata("design:type", Owner_1.Owner)
], Room.prototype, "owner", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [UserHistory_1.UserHistory]),
    (0, typeorm_1.OneToMany)(() => UserHistory_1.UserHistory, (history) => history.room),
    __metadata("design:type", Array)
], Room.prototype, "histories", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [RoomRate_1.RoomRate]),
    (0, typeorm_1.OneToMany)(() => RoomRate_1.RoomRate, (rate) => rate.room),
    __metadata("design:type", Array)
], Room.prototype, "rates", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Invite_1.Invite]),
    (0, typeorm_1.OneToMany)(() => Invite_1.Invite, (invite) => invite.room),
    __metadata("design:type", Array)
], Room.prototype, "invites", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Contract_1.Contract]),
    (0, typeorm_1.OneToMany)(() => Contract_1.Contract, (contract) => contract.room),
    __metadata("design:type", Array)
], Room.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Room.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Room.prototype, "updatedAt", void 0);
Room = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Room);
exports.Room = Room;
//# sourceMappingURL=Room.js.map