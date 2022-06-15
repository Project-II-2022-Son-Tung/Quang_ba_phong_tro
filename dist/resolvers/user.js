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
exports.UserResolver = void 0;
const User_1 = require("../entities/User");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const UserMutationResponse_1 = require("../types/UserMutationResponse");
const validateRegisterInput_1 = require("../utils/validateRegisterInput");
const LoginInput_1 = require("../types/LoginInput");
const constants_1 = require("../constants");
const ForgotPassword_1 = require("../types/ForgotPassword");
const sendEmail_1 = require("../utils/sendEmail");
const Token_1 = require("../models/Token");
const uuid_1 = require("uuid");
const ChangePasswordInput_1 = require("../types/ChangePasswordInput");
const UserRegisterInput_1 = require("../types/UserRegisterInput");
const Wallet_1 = require("../entities/Wallet");
const Identification_1 = require("../entities/Identification");
let UserResolver = class UserResolver {
    async me(ctx) {
        if (!ctx.req.session.userId) {
            return null;
        }
        const user = await User_1.User.findOne({
            where: {
                id: ctx.req.session.userId
            },
            relations: ["identification", "wallet"]
        });
        return user;
    }
    async register(registerInput, myContext) {
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
                const existingUser = await transactionEntityManager.findOne(User_1.User, { where: [{ email }, { username }] });
                if (existingUser) {
                    return {
                        code: 400,
                        success: false,
                        message: "User already exists",
                        errors: [
                            {
                                field: existingUser.username === username ? 'username' : 'email',
                                message: `${existingUser.username === username ? 'Username' : 'Email'} already exists`
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
                const newUser = transactionEntityManager.create(User_1.User, {
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
                await transactionEntityManager.save(newUser);
                myContext.req.session.userId = newUser.id;
                myContext.req.session.name = newUser.fullName;
                myContext.req.session.role = 'user';
                myContext.req.session.save(err => {
                    if (err) {
                        throw new Error(err);
                    }
                });
                return {
                    code: 200,
                    success: true,
                    message: "User registration successfully",
                    user: newUser
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
    async login(loginInput, myContext) {
        const { usernameOrEmail, password } = loginInput;
        try {
            const existingUser = await User_1.User.findOne({
                where: usernameOrEmail.includes("@") ? { email: usernameOrEmail } : { username: usernameOrEmail },
            });
            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: "User not found",
                    errors: [
                        {
                            field: 'usernameOrEmail',
                            message: 'Username or email incorrect'
                        }
                    ]
                };
            }
            const validPassword = await argon2_1.default.verify(existingUser.password, password);
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
            myContext.req.session.userId = existingUser.id;
            myContext.req.session.name = existingUser.fullName;
            myContext.req.session.role = 'user';
            myContext.req.session.save(err => {
                if (err) {
                    throw new Error(err);
                }
            });
            return {
                code: 200,
                success: true,
                message: "User login successfully",
                user: existingUser
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
    async forgotPassword(forgotPasswordInput) {
        const user = await User_1.User.findOne({
            where: { email: forgotPasswordInput.email }
        });
        if (!user) {
            return false;
        }
        await Token_1.TokenModel.findOneAndDelete({ userId: user.id });
        const resetToken = (0, uuid_1.v4)();
        const hashedResetToken = await argon2_1.default.hash(resetToken);
        await new Token_1.TokenModel({
            userId: user.id,
            token: hashedResetToken
        }).save();
        await (0, sendEmail_1.sendEmail)(forgotPasswordInput.email, `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password</a>`);
        return true;
    }
    async changePassword(ctx, token, userId, changePasswordInput) {
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
            const user = await User_1.User.findOne({
                where: { id: userId }
            });
            if (!user) {
                return {
                    code: 400,
                    success: false,
                    message: "User not found",
                    errors: [
                        {
                            field: 'token',
                            message: 'User not found'
                        }
                    ]
                };
            }
            const updatedPassword = await argon2_1.default.hash(changePasswordInput.newPassword);
            await User_1.User.update({ id: userId }, { password: updatedPassword });
            await resePasswordToken.deleteOne();
            ctx.req.session.userId = user.id;
            return {
                code: 200,
                success: true,
                message: "Password successfully changed",
                user
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
};
__decorate([
    (0, type_graphql_1.Query)(_return => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserRegisterInput_1.UserRegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('loginInput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => Boolean),
    __param(0, (0, type_graphql_1.Arg)("forgotPasswordInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPassword_1.ForgotPasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __param(3, (0, type_graphql_1.Arg)('changePasswordInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, ChangePasswordInput_1.ChangePasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map