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
exports.Districts = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Provinces_1 = require("./Provinces");
const Room_1 = require("./Room");
const Wards_1 = require("./Wards");
let Districts = class Districts extends typeorm_1.BaseEntity {
    code;
    name;
    name_en;
    full_name;
    full_name_en;
    code_name;
    province_code;
    province;
    rooms;
    wards;
    administrative_unit_id;
};
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.PrimaryColumn)({ length: 20 }),
    __metadata("design:type", String)
], Districts.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Districts.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Districts.prototype, "name_en", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String, { nullable: true }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Districts.prototype, "full_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String, { nullable: true }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Districts.prototype, "full_name_en", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String, { nullable: true }),
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Districts.prototype, "code_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Districts.prototype, "province_code", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => Provinces_1.Provinces),
    (0, typeorm_1.ManyToMany)(() => Provinces_1.Provinces, (province) => province.districts, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "province_code" }),
    __metadata("design:type", Provinces_1.Provinces)
], Districts.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Room_1.Room]),
    (0, typeorm_1.OneToMany)(() => Room_1.Room, (room) => room.district),
    __metadata("design:type", Array)
], Districts.prototype, "rooms", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [Wards_1.Wards]),
    (0, typeorm_1.OneToMany)(() => Wards_1.Wards, (ward) => ward.district, { cascade: true }),
    __metadata("design:type", Array)
], Districts.prototype, "wards", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Districts.prototype, "administrative_unit_id", void 0);
Districts = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Districts);
exports.Districts = Districts;
//# sourceMappingURL=Districts.js.map