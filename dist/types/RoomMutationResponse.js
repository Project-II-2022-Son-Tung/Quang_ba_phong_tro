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
exports.RoomMutationResponse = void 0;
const Room_1 = require("../entities/Room");
const type_graphql_1 = require("type-graphql");
const MutationResponse_1 = require("./MutationResponse");
const FieldError_1 = require("./FieldError");
let RoomMutationResponse = class RoomMutationResponse {
    code;
    success;
    message;
    room;
    errors;
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Room_1.Room)
], RoomMutationResponse.prototype, "room", void 0);
__decorate([
    (0, type_graphql_1.Field)(_type => [FieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], RoomMutationResponse.prototype, "errors", void 0);
RoomMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: MutationResponse_1.IMutationResponse })
], RoomMutationResponse);
exports.RoomMutationResponse = RoomMutationResponse;
//# sourceMappingURL=RoomMutationResponse.js.map