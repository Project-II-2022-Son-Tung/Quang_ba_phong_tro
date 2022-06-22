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
exports.AdminResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const constants_1 = require("../constants");
const Admin_1 = require("../entities/Admin");
const AdminMutationResponse_1 = require("../types/AdminMutationResponse");
const LoginInput_1 = require("../types/LoginInput");
const AdminRegisterInput_1 = require("../types/AdminRegisterInput");
const validateRegisterInput_1 = require("../utils/validateRegisterInput");
let AdminResolver = class AdminResolver {
    async meAdmin(ctx) {
        if ((!ctx.req.session.userId) || ctx.req.session.role !== 'admin') {
            return null;
        }
        console.log(ctx.req.session.userId);
        const admin = await Admin_1.Admin.findOne({
            where: {
                id: ctx.req.session.userId
            }
        });
        return admin;
    }
    async registerAdmin(registerInput, ctx) {
        const validateRegisterInputErrors = (0, validateRegisterInput_1.validateRegisterInput)(registerInput);
        if (validateRegisterInputErrors !== null) {
            return {
                code: 400,
                success: false,
                ...validateRegisterInputErrors
            };
        }
        try {
            const { username, email, password, fullName } = registerInput;
            const existingAdmin = await Admin_1.Admin.findOne({ where: [{ email }, { username }] });
            if (existingAdmin) {
                return {
                    code: 400,
                    success: false,
                    message: "Admin already exists",
                    errors: [
                        {
                            field: existingAdmin.username === username ? 'username' : 'email',
                            message: `${existingAdmin.username === username ? 'Username' : 'Email'} already exists`
                        }
                    ]
                };
            }
            const hashedPassword = await argon2_1.default.hash(password);
            const newAdmin = Admin_1.Admin.create({
                email,
                username,
                password: hashedPassword,
                fullName
            });
            await newAdmin.save();
            ctx.req.session.userId = newAdmin.id;
            ctx.req.session.name = newAdmin.fullName;
            ctx.req.session.role = 'admin';
            ctx.req.session.save(err => {
                if (err) {
                    throw new Error(err);
                }
            });
            return {
                code: 200,
                success: true,
                message: "Admin registration successfully",
                admin: newAdmin
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
    async loginAdmin(loginInput, ctx) {
        const { usernameOrEmail, password } = loginInput;
        try {
            const existingAdmin = await ctx.connection.getRepository(Admin_1.Admin)
                .createQueryBuilder("admin")
                .where(usernameOrEmail.includes("@") ? "admin.email = :email" : "admin.username = :username", {
                username: usernameOrEmail,
                email: usernameOrEmail
            })
                .addSelect("admin.password")
                .getOne();
            if (!existingAdmin) {
                return {
                    code: 400,
                    success: false,
                    message: "Admin not found",
                    errors: [
                        {
                            field: 'usernameOrEmail',
                            message: 'Username or email incorrect'
                        }
                    ]
                };
            }
            const validPassword = await argon2_1.default.verify(existingAdmin.password, password);
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
            ctx.req.session.userId = existingAdmin.id;
            ctx.req.session.name = existingAdmin.fullName;
            ctx.req.session.role = 'admin';
            ctx.req.session.save(err => {
                if (err) {
                    throw new Error(err);
                }
            });
            return {
                code: 200,
                success: true,
                message: "Admin login successfully",
                admin: existingAdmin
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
};
__decorate([
    (0, type_graphql_1.Query)(_return => Admin_1.Admin, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "meAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => AdminMutationResponse_1.AdminMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdminRegisterInput_1.AdminRegisterInput, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "registerAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => AdminMutationResponse_1.AdminMutationResponse),
    __param(0, (0, type_graphql_1.Arg)('loginInput')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "loginAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(_return => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "logout", null);
AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)(_of => Admin_1.Admin)
], AdminResolver);
exports.AdminResolver = AdminResolver;
//# sourceMappingURL=admin.js.map