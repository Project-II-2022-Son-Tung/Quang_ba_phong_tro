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
exports.Wallet = exports.WalletStatus = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
var WalletStatus;
(function (WalletStatus) {
    WalletStatus["ACTIVE"] = "ACTIVE";
    WalletStatus["INACTIVE"] = "INACTIVE";
    WalletStatus["LOCKED"] = "LOCKED";
})(WalletStatus = exports.WalletStatus || (exports.WalletStatus = {}));
let Wallet = class Wallet extends typeorm_1.BaseEntity {
    id;
    balance;
    availableBalance;
    status;
    createdAt;
    updatedAt;
};
__decorate([
    (0, type_graphql_1.Field)(_type => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Wallet.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Wallet.prototype, "balance", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Wallet.prototype, "availableBalance", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => String),
    (0, typeorm_1.Column)({ type: "enum", enum: WalletStatus, default: WalletStatus.INACTIVE }),
    __metadata("design:type", String)
], Wallet.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Wallet.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamptz" }),
    __metadata("design:type", Date)
], Wallet.prototype, "updatedAt", void 0);
Wallet = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Wallet);
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map