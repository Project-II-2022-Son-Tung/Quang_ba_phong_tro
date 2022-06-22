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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Contract_1 = require("./Contract");
const OwnerRate_1 = require("./OwnerRate");
const type_graphql_1 = require("type-graphql");
const Identification_1 = require("./Identification");
const UserHistory_1 = require("./UserHistory");
const Invite_1 = require("./Invite");
const Wallet_1 = require("./Wallet");
let User = class User extends typeorm_1.BaseEntity {
    id;
    username;
    fullName;
    avatarUrl;
    email;
    password;
    identificationId;
    identification;
    address;
    phoneNumber;
    wallet;
    rates;
    contracts;
    invites;
    histories;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.Column)("uuid"),
    __metadata("design:type", String)
], User.prototype, "identificationId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.OneToOne)(() => Identification_1.Identification, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: "identificationId" }),
    __metadata("design:type", Identification_1.Identification)
], User.prototype, "identification", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Wallet_1.Wallet),
    (0, typeorm_1.OneToOne)(() => Wallet_1.Wallet, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Wallet_1.Wallet)
], User.prototype, "wallet", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [OwnerRate_1.OwnerRate], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => OwnerRate_1.OwnerRate, (rate) => rate.user),
    __metadata("design:type", Array)
], User.prototype, "rates", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Contract_1.Contract], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Contract_1.Contract, (contract) => contract.user),
    __metadata("design:type", Array)
], User.prototype, "contracts", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Invite_1.Invite], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Invite_1.Invite, (invite) => invite.user),
    __metadata("design:type", Array)
], User.prototype, "invites", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [UserHistory_1.UserHistory], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => UserHistory_1.UserHistory, (history) => history.user),
    __metadata("design:type", Array)
], User.prototype, "histories", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map