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
exports.Admin = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let Admin = class Admin extends typeorm_1.BaseEntity {
    id;
    username;
    email;
    password;
    fullName;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Admin.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Admin.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Admin.prototype, "fullName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Admin.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Admin.prototype, "updatedAt", void 0);
Admin = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Admin);
exports.Admin = Admin;
//# sourceMappingURL=Admin.js.map