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
exports.Wards = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Districts_1 = require("./Districts");
const Room_1 = require("./Room");
let Wards = class Wards extends typeorm_1.BaseEntity {
    code;
    name;
    name_en;
    full_name;
    full_name_en;
    code_name;
    district_code;
    rooms;
    district;
    administrative_unit_id;
};
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.PrimaryColumn)({ length: 20 }),
    __metadata("design:type", String)
], Wards.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Wards.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Wards.prototype, "name_en", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String, { nullable: true }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Wards.prototype, "full_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String, { nullable: true }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Wards.prototype, "full_name_en", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String, { nullable: true }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Wards.prototype, "code_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Wards.prototype, "district_code", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Room_1.Room]),
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (room) => room.ward),
    __metadata("design:type", Array)
], Wards.prototype, "rooms", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Districts_1.Districts),
    (0, typeorm_1.ManyToMany)(() => Districts_1.Districts, (district) => district.wards, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "district_code" }),
    __metadata("design:type", Districts_1.Districts)
], Wards.prototype, "district", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Wards.prototype, "administrative_unit_id", void 0);
Wards = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Wards);
exports.Wards = Wards;
//# sourceMappingURL=Wards.js.map