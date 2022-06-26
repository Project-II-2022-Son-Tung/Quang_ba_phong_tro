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
exports.DistrictsResolver = void 0;
const Wards_1 = require("../entities/Wards");
const type_graphql_1 = require("type-graphql");
const Districts_1 = require("../entities/Districts");
let DistrictsResolver = class DistrictsResolver {
    async districts() {
        return await Districts_1.Districts.find();
    }
    async districtsOfProvince(provinceCode) {
        return await Districts_1.Districts.find({
            where: {
                province_code: provinceCode
            }
        });
    }
    async wards(root) {
        return await Wards_1.Wards.find({
            where: {
                district_code: root.code
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(_return => [Districts_1.Districts]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DistrictsResolver.prototype, "districts", null);
__decorate([
    (0, type_graphql_1.Query)(_return => [Districts_1.Districts]),
    __param(0, (0, type_graphql_1.Arg)("provinceCode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DistrictsResolver.prototype, "districtsOfProvince", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(_return => [Wards_1.Wards]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Districts_1.Districts]),
    __metadata("design:returntype", Promise)
], DistrictsResolver.prototype, "wards", null);
DistrictsResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => Districts_1.Districts)
], DistrictsResolver);
exports.DistrictsResolver = DistrictsResolver;
//# sourceMappingURL=district.js.map