import { User } from "../entities/User";
import { Arg,  Ctx,  FieldResolver,  Mutation, Query, Resolver, Root } from "type-graphql";
import argon2 from "argon2";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/LoginInput";
import { MyContext } from "../types/MyContext";
import { COOKIE_NAME } from "../constants";
import { ForgotPasswordInput } from "../types/ForgotPassword";
import { sendEmail } from "../utils/sendEmail";
import { TokenModel } from "../models/Token";
import { v4 as uuidv4} from "uuid"; 
import { ChangePasswordInput } from "../types/ChangePasswordInput";
import { UserProfile } from "../entities/UserProfile";
import { UserGender } from "../entities/UserProfile";
import { UserRegisterInput } from "../types/UserRegisterInput";
import { UserBalance } from "../entities/UserBalance";
import { Schedule } from "../entities/Schedule";

@Resolver(_of => User)
export class UserResolver {

    @Query(_return => User, {nullable: true})
    async me(
        @Ctx() ctx: MyContext
    ): Promise<User| undefined | null> {
        if(!ctx.req.session.userId) {
            return null;
        }
        const user = await User.findOne(ctx.req.session.userId,  { relations: ["profile", "balance"] });
        return user;

    }

    @FieldResolver(_return => [Schedule])
    async schedules(
        @Root() user: User
    ): Promise<Schedule[]> {
        return await Schedule.find({where: {userId: user.id}});
    }

    @Mutation(_return => UserMutationResponse)
    async register(
        @Arg("registerInput") registerInput: UserRegisterInput,
        @Ctx() myContext: MyContext
    ) : Promise<UserMutationResponse> {
        const connection = myContext.connection;
        return await connection.transaction(async transactionEntityManager =>{
            const validateRegisterInputErrors = validateRegisterInput(registerInput);
            if(validateRegisterInputErrors !== null) {
                return {
                    code: 400,
                    success: false,
                    ...validateRegisterInputErrors
                }
            }
            try{
                const {username, email, password, fullName, address, age, country, avatar, gender, timezone} = registerInput;
                const existingUser = await transactionEntityManager.findOne(User, {where: [{email}, {username}]});
                if (existingUser) {
                    return {
                        code: 400,
                        success: false,
                        message: "User already exists",
                        errors: [
                            {
                                field: existingUser.username === username ? 'username' : 'email', 
                                message: `${ existingUser.username === username ? 'Username' : 'Email'} already exists`
                            }
                        ]
                    }
                }
                const hashedPassword = await argon2.hash(password);
                let nGender = gender as UserGender;
                const uProfile = transactionEntityManager.create(UserProfile,{
                    country,
                    address,
                    age,
                    avatar,
                    gender: nGender,
                    timezone : timezone ? timezone : (Intl.DateTimeFormat().resolvedOptions().timeZone)
                })
                await transactionEntityManager.save(uProfile);
                const uBalance = transactionEntityManager.create(UserBalance, {
                    ammount: 0,
                    unit: country == "Vietnam" ? "VND" : "USD"

                });
                await transactionEntityManager.save(uBalance);
                const newUser = transactionEntityManager.create(User,{
                    email,
                    username,
                    password: hashedPassword,
                    fullName,
                    profile: uProfile,
                    balance: uBalance
                });
                await transactionEntityManager.save(newUser);
                myContext.req.session.userId = newUser.id;
                return {
                    code: 200,
                    success: true,
                    message: "User registration successfully",
                    user: newUser
                }
            } catch(err) {
                console.log(err);
                return {
                    code: 500,
                    success: false,
                    message: `Internal server error ${err.message}`
                }
            }
        })
    }

    @Mutation(_return => UserMutationResponse)
    async login(
        @Arg('loginInput') loginInput: LoginInput,
        @Ctx() ctx: MyContext
        )
     : Promise<UserMutationResponse>{
        const {usernameOrEmail, password} = loginInput;
        try{
            const existingUser = await User.findOne(
                usernameOrEmail.includes("@") ? {email: usernameOrEmail} : {username: usernameOrEmail});
            if(!existingUser) {
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
                }
            }
            const validPassword = await argon2.verify(existingUser.password, password);
            if(!validPassword) {
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
                }
            }

            // Create session and return cookie
            ctx.req.session.userId = existingUser.id;

            return{
                code: 200,
                success: true,
                message: "User login successfully",
                user: existingUser
            }

        } catch(err) {
            console.log(err);
            return {
                code: 500,
                success: false,
                message: `Internal server error ${err.message}`
            }
        }
    }

    @Mutation(_return => Boolean)
    logout(
        @Ctx() ctx: MyContext
    ) : Promise<boolean> {
        return new Promise((resolve, _reject) => {
            ctx.res.clearCookie(COOKIE_NAME);
            ctx.req.session.destroy(err => {
                if(err) {
                    console.log(err);
                    resolve(false);
                }
                resolve(true);
            });
        })
    }

    @Mutation(_return => Boolean)
    async forgotPassword(
        @Arg("forgotPasswordInput") forgotPasswordInput: ForgotPasswordInput
    ) : Promise<boolean> {
        const user = await User.findOne({email: forgotPasswordInput.email});
        if(!user) {
            return false;
        }
        
        await TokenModel.findOneAndDelete({userId: user.id})
        const resetToken = uuidv4();
        const hashedResetToken = await argon2.hash(resetToken);



        await new TokenModel({
            userId: user.id,
            token: hashedResetToken
        }).save();



        await sendEmail(forgotPasswordInput.email, `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${user.id}">Click here to reset your password</a>`);
        return true;
    }

    @Mutation(_return => UserMutationResponse)
    async changePassword(
        @Ctx() ctx: MyContext,
        @Arg('token') token: string,
        @Arg('userId') userId: string,
        @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput
    ): Promise<UserMutationResponse>{
        if(changePasswordInput.newPassword.length <= 5){
            return { 
                code:400,
                success: false, 
                message: 'Invalid password', 
                errors:[
                    {field: 'newPassword', message: 'Length must be greater than 5'}
                ]
            }
        }
            try {
                const resePasswordToken = await TokenModel.findOne({userId})
                if(!resePasswordToken) {
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
                    }
                }
                const resetPasswordTokenValid = argon2.verify(resePasswordToken.token, token);
                if(!resetPasswordTokenValid) {
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
                    }
                }
                const user = await User.findOne({id: userId});
                if(!user) {
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
                    }
                }
                const updatedPassword = await argon2.hash(changePasswordInput.newPassword);
                await User.update({id: userId}, {password: updatedPassword});
                await resePasswordToken.deleteOne();
                ctx.req.session.userId = user.id;
                return {
                    code: 200,
                    success: true,
                    message: "Password successfully changed",
                    user
                }

            } catch (error) {
                console.log(error)
                return { 
                    code:500,
                    success: false, 
                    message: 'Internal server error'
                }
            }
    }
}