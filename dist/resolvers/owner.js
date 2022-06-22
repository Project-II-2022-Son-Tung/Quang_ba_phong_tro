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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerResolver = void 0;
const Owner_1 = require("../entities/Owner");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const OwnerMutationResponse_1 = require("../types/OwnerMutationResponse");
const validateRegisterInput_1 = require("../utils/validateRegisterInput");
const LoginInput_1 = require("../types/LoginInput");
const constants_1 = require("../constants");
const ForgotPassword_1 = require("../types/ForgotPassword");
const sendEmail_1 = require("../utils/sendEmail");
const Token_1 = require("../models/Token");
const uuid_1 = require("uuid");
const ChangePasswordInput_1 = require("../types/ChangePasswordInput");
const OwnerRegisterInput_1 = require("../types/OwnerRegisterInput");
const Wallet_1 = require("../entities/Wallet");
const Identification_1 = require("../entities/Identification");
const UpdateUIInput_1 = require("../types/UpdateUIInput");
let OwnerResolver = class OwnerResolver {
    async meOwner(ctx) {
        if ((!ctx.req.session.userId) || ctx.req.session.role !== 'owner') {
            return null;
        }
        const owner = await Owner_1.Owner.findOne({
            where: {
                id: ctx.req.session.userId
            },
            relations: ["identification", "wallet"],
        });
        return owner;
    }
    async registerOwner(registerInput, myContext) {
        const connection = myContext.connection;
        return await connection.transaction(async (transactionEntityManager) => {
            const validateRegisterInputErrors = (0, validateRegisterInput_1.validateRegisterInput)(registerInput);
            if (validateRegisterInputErrors !== null) {
                return {
                    code: 400,
                    success: false,
                    ...validateRegisterInputErrors
                };
            }
            try {
                const { username, email, password, fullName, address, identificationId, issueDate, issuedBy, avatarUrl, phoneNumber } = registerInput;
                const existingOwner = await transactionEntityManager.findOne(Owner_1.Owner, { where: [{ email }, { username }] });
                if (existingOwner) {
                    return {
                        code: 400,
                        success: false,
                        message: "Owner already exists",
                        errors: [
                            {
                                field: existingOwner.username === username ? 'username' : 'email',
                                message: `${existingOwner.username === username ? 'Ownername' : 'Email'} already exists`
                            }
                        ]
                    };
                }
                const hashedPassword = await argon2_1.default.hash(password);
                const uBalance = transactionEntityManager.create(Wallet_1.Wallet, {
                    balance: 0,
                    availableBalance: 0,
                });
                await transactionEntityManager.save(uBalance);
                if (!identificationId || !issueDate || !issuedBy) {
                    throw new Error("Identification is required");
                }
                const uIdent = transactionEntityManager.create(Identification_1.Identification, {
                    serial: identificationId,
                    issueDate,
                    issuedBy,
                });
                await transactionEntityManager.save(uIdent);
                const newOwner = transactionEntityManager.create(Owner_1.Owner, {
                    email,
                    username,
                    password: hashedPassword,
                    fullName,
                    address,
                    avatarUrl,
                    phoneNumber,
                    wallet: uBalance,
                    identification: uIdent,
                });
                await transactionEntityManager.save(newOwner);
                myContext.req.session.userId = newOwner.id;
                myContext.req.session.name = newOwner.fullName;
                myContext.req.session.role = 'owner';
                myContext.req.session.save(err => {
                    if (err) {
                        throw new Error(err);
                    }
                });
                return {
                    code: 200,
                    success: true,
                    message: "Owner registration successfully",
                    owner: newOwner
                };
            }
            catch (err) {
                console.log(err);
                return {
                    code: 500,
                    success: false,
                    message: `Internal server error ${err.message}`
                };
            }
        });
    }
    async loginOwner(loginInput, myContext) {
        const { usernameOrEmail, password } = loginInput;
        try {
            const existingOwner = await myContext.connection.getRepository(Owner_1.Owner)
                .createQueryBuilder("owner")
                .where(usernameOrEmail.includes("@") ? "owner.email = :email" : "owner.username = :username", {
                email: usernameOrEmail,
                username: usernameOrEmail,
            })
                .addSelect("owner.password")
                .getOne();
            if (!existingOwner) {
                return {
                    code: 400,
                    success: false,
                    message: "Owner not found",
                    errors: [
                        {
                            field: 'usernameOrEmail',
                            message: 'Ownername or email incorrect'
                        }
                    ]
                };
            }
            const validPassword = await argon2_1.default.verify(existingOwner.password, password);
            if (!validPassword) {
                return {
                    code: 400,
                    success: false,
                    message: "Password incorrect",
                    errors: [
                        {
                            field: 'password',
                            message: 'Password incorrect'
                        }
                    ]
                };
            }
            myContext.req.session.userId = existingOwner.id;
            myContext.req.session.name = existingOwner.fullName;
            myContext.req.session.role = 'owner';
            myContext.req.session.save(err => {
                if (err) {
                    throw new Error(err);
                }
            });
            return {
                code: 200,
                success: true,
                message: "Owner login successfully",
                owner: existingOwner
            };
        }
        catch (err) {
            console.log(err);
            return {
                code: 500,
                success: false,
                message: `Internal server error ${err.message}`
            };
        }
    }
    logout(ctx) {
        return new Promise((resolve, _reject) => {
            ctx.res.clearCookie(constants_1.COOKIE_NAME);
            ctx.req.session.destroy(err => {
                if (err) {
                    console.log(err);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
    async forgotPasswordOwner(forgotPasswordInput) {
        const owner = await Owner_1.Owner.findOne({
            where: { email: forgotPasswordInput.email }
        });
        if (!owner) {
            return false;
        }
        await Token_1.TokenModel.findOneAndDelete({ userId: owner.id });
        const resetToken = (0, uuid_1.v4)();
        const hashedResetToken = await argon2_1.default.hash(resetToken);
        await new Token_1.TokenModel({
            userId: owner.id,
            token: hashedResetToken
        }).save();
        await (0, sendEmail_1.sendEmail)(forgotPasswordInput.email, `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${owner.id}">Click here to reset your password</a>`);
        return true;
    }
    async changePasswordOwner(ctx, token, userId, changePasswordInput) {
        if (changePasswordInput.newPassword.length <= 5) {
            return {
                code: 400,
                success: false,
                message: 'Invalid password',
                errors: [
                    { field: 'newPassword', message: 'Length must be greater than 5' }
                ]
            };
        }
        try {
            const resePasswordToken = await Token_1.TokenModel.findOne({ userId });
            if (!resePasswordToken) {
                return {
                    code: 400,
                    success: false,
                    message: "Token invalid or expired",
                    errors: [
                        {
                            field: 'token',
                            message: 'Token invalid or expired'
                        }
                    ]
                };
            }
            const resetPasswordTokenValid = argon2_1.default.verify(resePasswordToken.token, token);
            if (!resetPasswordTokenValid) {
                return {
                    code: 400,
                    success: false,
                    message: "Token invalid or expired",
                    errors: [
                        {
                            field: 'token',
                            message: 'Token invalid or expired'
                        }
                    ]
                };
            }
            const owner = await Owner_1.Owner.findOne({
                where: { id: userId }
            });
            if (!owner) {
                return {
                    code: 400,
                    success: false,
                    message: "Owner not found",
                    errors: [
                        {
                            field: 'token',
                            message: 'Owner not found'
                        }
                    ]
                };
            }
            const updatedPassword = await argon2_1.default.hash(changePasswordInput.newPassword);
            await Owner_1.Owner.update({ id: userId }, { password: updatedPassword });
            await resePasswordToken.deleteOne();
            ctx.req.session.userId = owner.id;
            return {
                code: 200,
                success: true,
                message: "Password successfully changed",
                owner
            };
        }
        catch (error) {
            console.log(error);
            return {
                code: 500,
                success: false,
                message: 'Internal server error'
            };
        }
    }
    async updateOwner(updateOwnerInput, ctx) {
        if ((!ctx.req.session.userId) || ctx.req.session.role !== 'owner') {
            return {
                code: 401,
                success: false,
                message: "Unauthorized",
                errors: [
                    {
                        field: 'token',
                        message: 'Unauthorized'
                    }
                ]
            };
        }
        const owner = await Owner_1.Owner.findOne({
            where: { id: ctx.req.session.userId },
            relations: ["identification", "wallet"],
        });
        if (!owner) {
            return {
                code: 400,
                success: false,
                message: "Owner not found",
                errors: [
                    {
                        field: 'token',
                        message: 'Owner not found'
                    }
                ]
            };
        }
        if (Object.keys(updateOwnerInput).length < 1) {
            return {
                code: 400,
                success: false,
                message: "No data to update",
                errors: [
                    {
                        field: 'updateOwnerInput',
                        message: 'No data to update'
                    }
                ]
            };
        }
        if (updateOwnerInput.identificationId && updateOwnerInput.identificationId !== owner.identificationId
            && updateOwnerInput.issueDate && updateOwnerInput.issuedBy) {
            await Identification_1.Identification.update({ id: owner.identificationId }, {
                serial: updateOwnerInput.identificationId,
                issueDate: updateOwnerInput.issueDate,
                issuedBy: updateOwnerInput.issuedBy
            });
        }
        updateOwnerInput.fullName ? owner.fullName = updateOwnerInput.fullName : null;
        updateOwnerInput.avatarUrl ? owner.avatarUrl = updateOwnerInput.avatarUrl : null;
        updateOwnerInput.phoneNumber ? owner.phoneNumber = updateOwnerInput.phoneNumber : null;
        updateOwnerInput.address ? owner.address = updateOwnerInput.address : null;
        await owner.save();
        return {
            code: 200,
            success: true,
            message: "Owner updated successfully",
            owner
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(_return => Owner_1.Owner, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "meOwner", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => OwnerMutationResponse_1.OwnerMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OwnerRegisterInput_1.OwnerRegisterInput, Object]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "registerOwner", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => OwnerMutationResponse_1.OwnerMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('loginInput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "loginOwner", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => Boolean),
    __param(0, (0, type_graphql_1.Arg)("forgotPasswordInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPassword_1.ForgotPasswordInput]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "forgotPasswordOwner", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => OwnerMutationResponse_1.OwnerMutationResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __param(3, (0, type_graphql_1.Arg)('changePasswordInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, ChangePasswordInput_1.ChangePasswordInput]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "changePasswordOwner", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => OwnerMutationResponse_1.OwnerMutationResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)('updateOwnerInput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUIInput_1.UpdateUIInput, Object]),
    __metadata("design:returntype", Promise)
], OwnerResolver.prototype, "updateOwner", null);
OwnerResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => Owner_1.Owner)
], OwnerResolver);
exports.OwnerResolver = OwnerResolver;
//# sourceMappingURL=owner.js.map