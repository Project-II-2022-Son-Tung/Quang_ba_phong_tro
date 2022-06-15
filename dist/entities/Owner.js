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
exports.Owner = void 0;
const typeorm_1 = require("typeorm");
const Wallet_1 = require("./Wallet");
const Contract_1 = require("./Contract");
const OwnerRate_1 = require("./OwnerRate");
const Room_1 = require("./Room");
const type_graphql_1 = require("type-graphql");
const Identification_1 = require("./Identification");
const OwnerHistory_1 = require("./OwnerHistory");
const Invite_1 = require("./Invite");
let Owner = class Owner extends typeorm_1.BaseEntity {
    id;
    username;
    fullName;
    avatarUrl;
    email;
    password;
    rate;
    address;
    identificationId;
    identification;
    phoneNumber;
    wallet;
    rates;
    contracts;
    histories;
    invites;
    rooms;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Owner.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Owner.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Owner.prototype, "fullName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Owner.prototype, "avatarUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Owner.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Owner.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Owner.prototype, "rate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Owner.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], Owner.prototype, "identificationId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.OneToOne)(() => Identification_1.Identification, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "identificationId" }),
    __metadata("design:type", Identification_1.Identification)
], Owner.prototype, "identification", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Owner.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Wallet_1.Wallet),
    (0, typeorm_1.OneToOne)(() => Wallet_1.Wallet, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Wallet_1.Wallet)
], Owner.prototype, "wallet", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [OwnerRate_1.OwnerRate], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => OwnerRate_1.OwnerRate, (rate) => rate.owner),
    __metadata("design:type", Array)
], Owner.prototype, "rates", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Contract_1.Contract], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Contract_1.Contract, (contract) => contract.owner),
    __metadata("design:type", Array)
], Owner.prototype, "contracts", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [OwnerHistory_1.OwnerHistory], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => OwnerHistory_1.OwnerHistory, (history) => history.owner),
    __metadata("design:type", Array)
], Owner.prototype, "histories", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Invite_1.Invite], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Invite_1.Invite, (invite) => invite.owner),
    __metadata("design:type", Array)
], Owner.prototype, "invites", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Room_1.Room], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (room) => room.owner),
    __metadata("design:type", Array)
], Owner.prototype, "rooms", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Owner.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Owner.prototype, "updatedAt", void 0);
Owner = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Owner);
exports.Owner = Owner;
//# sourceMappingURL=Owner.js.map