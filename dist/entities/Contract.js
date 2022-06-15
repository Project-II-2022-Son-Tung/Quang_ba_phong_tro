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
exports.Contract = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Owner_1 = require("./Owner");
const Room_1 = require("./Room");
const User_1 = require("./User");
let Contract = class Contract extends typeorm_1.BaseEntity {
    id;
    leasePrice;
    deposit;
    contractFee;
    address;
    contractDuration;
    additionalAgreements;
    status;
    room;
    owner;
    user;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Contract.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contract.prototype, "leasePrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contract.prototype, "deposit", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Contract.prototype, "contractFee", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Contract.prototype, "contractDuration", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "additionalAgreements", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contract.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Room_1.Room),
    (0, typeorm_1.ManyToOne)(() => Room_1.Room, (room) => room.contracts, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Room_1.Room)
], Contract.prototype, "room", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Owner_1.Owner),
    (0, typeorm_1.ManyToOne)(() => Owner_1.Owner, (owner) => owner.contracts, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Owner_1.Owner)
], Contract.prototype, "owner", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => User_1.User),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.contracts, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], Contract.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Contract.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Contract.prototype, "updatedAt", void 0);
Contract = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Contract);
exports.Contract = Contract;
//# sourceMappingURL=Contract.js.map