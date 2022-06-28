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
exports.RoomFilterInput = exports.FilterRange = void 0;
const type_graphql_1 = require("type-graphql");
let FilterRange = class FilterRange {
    min;
    max;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], FilterRange.prototype, "min", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], FilterRange.prototype, "max", void 0);
FilterRange = __decorate([
    (0, type_graphql_1.InputType)()
], FilterRange);
exports.FilterRange = FilterRange;
let RoomFilterInput = class RoomFilterInput {
    price;
    size;
    floor;
    maxOccupancy;
    electricPrice;
    waterPrice;
    parkingFee;
    numberOfFloors;
    lift;
    wifi;
    petAllowed;
    airConditioning;
    waterHeating;
    parking;
    enclosed;
    liveWithHost;
    provinceCode;
    districtCode;
    wardCode;
    search;
};
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "floor", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "maxOccupancy", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "electricPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "waterPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "parkingFee", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => FilterRange, { nullable: true }),
    __metadata("design:type", FilterRange)
], RoomFilterInput.prototype, "numberOfFloors", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "lift", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "wifi", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "petAllowed", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "airConditioning", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "waterHeating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "parking", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "enclosed", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RoomFilterInput.prototype, "liveWithHost", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [String], { nullable: true }),
    __metadata("design:type", Array)
], RoomFilterInput.prototype, "provinceCode", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [String], { nullable: true }),
    __metadata("design:type", Array)
], RoomFilterInput.prototype, "districtCode", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [String], { nullable: true }),
    __metadata("design:type", Array)
], RoomFilterInput.prototype, "wardCode", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RoomFilterInput.prototype, "search", void 0);
RoomFilterInput = __decorate([
    (0, type_graphql_1.InputType)()
], RoomFilterInput);
exports.RoomFilterInput = RoomFilterInput;
//# sourceMappingURL=RoomFilterInput.js.map