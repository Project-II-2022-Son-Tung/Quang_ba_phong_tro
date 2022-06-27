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
exports.RoomImageInput = exports.CreateRoomInput = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
let CreateRoomInput = class CreateRoomInput {
    ward;
    title;
    district;
    province;
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
    price;
    images;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomInput.prototype, "ward", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomInput.prototype, "district", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoomInput.prototype, "province", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateRoomInput.prototype, "address", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "size", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "floor", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateRoomInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "enclosed", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "maxOccupancy", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "liveWithHost", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "petsAllowed", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "electricPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "waterPrice", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "parking", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "parkingFee", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "waterHeating", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "airConditioning", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "wifi", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "wifiFee", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CreateRoomInput.prototype, "lift", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "numberOfFloors", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CreateRoomInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [RoomImageInput]),
    __metadata("design:type", Array)
], CreateRoomInput.prototype, "images", void 0);
CreateRoomInput = __decorate([
    (0, type_graphql_1.InputType)()
], CreateRoomInput);
exports.CreateRoomInput = CreateRoomInput;
let RoomImageInput = class RoomImageInput {
    fileUrl;
    caption;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], RoomImageInput.prototype, "fileUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RoomImageInput.prototype, "caption", void 0);
RoomImageInput = __decorate([
    (0, type_graphql_1.InputType)()
], RoomImageInput);
exports.RoomImageInput = RoomImageInput;
//# sourceMappingURL=CreateRoomInput.js.map