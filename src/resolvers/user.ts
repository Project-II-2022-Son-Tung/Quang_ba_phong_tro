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
import { UserRegisterInput } from "../types/UserRegisterInput";
import { Wallet } from "../entities/Wallet";
import { Identification } from "../entities/Identification";
import { UpdateUIInput } from "../types/UpdateUIInput";
import { RoomFavourite } from "../entities/RoomFavourite";

@Resolver(_of => User)
export class UserResolver {

    @Query(_return => User, {nullable: true})
    async me(
        @Ctx() ctx: MyContext
    ): Promise<User| undefined | null> {
        if((!ctx.req.session.userId) || ctx.req.session.role !== 'user') {
            return null;
        }
        const user = await User.findOne({
            where: {
                id: ctx.req.session.userId
            },
            relations: ["identification", "wallet"],
        });
        return user;

    }

    @FieldResolver(_return => [RoomFavourite])
    async roomFavourites(
        @Root() user: User,
    ) : Promise<RoomFavourite[]> {
        return await RoomFavourite.find({
            where: {
                userId: user.id
            },
            relations: ["room"]
        });
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
                const {username, email, password, fullName, address, identificationId, issueDate, issuedBy, avatarUrl, phoneNumber} = registerInput;
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
                const uBalance = transactionEntityManager.create(Wallet, {
                    balance: 0,
                    availableBalance: 0,
                });
                await transactionEntityManager.save(uBalance);
                
                if(!identificationId || !issueDate || !issuedBy) {
                    throw new Error("Identification is required");
                }

                const uIdent = transactionEntityManager.create(Identification, {
                    serial: identificationId,
                    issueDate,
                    issuedBy,
                });
                await transactionEntityManager.save(uIdent);

                const newUser = transactionEntityManager.create(User,{
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
                    if(err) {
                        throw new Error(err);
                    }
                }
                );
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
        @Ctx() myContext: MyContext
        )
     : Promise<UserMutationResponse>{
        const {usernameOrEmail, password} = loginInput;
        try{
            // const existingUser = await User.findOne({
            //     where: usernameOrEmail.includes("@") ? {email: usernameOrEmail} : {username: usernameOrEmail},
            // });
            const existingUser = await myContext.connection.getRepository(User)
                .createQueryBuilder("user")
                .where(usernameOrEmail.includes("@") ? "user.email = :email" : "user.username = :username", {
                    email: usernameOrEmail,
                    username: usernameOrEmail,
                })
                .addSelect("user.password")
                .getOne();
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
            myContext.req.session.userId = existingUser.id;
            myContext.req.session.name = existingUser.fullName;
            myContext.req.session.role = 'user';
            myContext.req.session.save(err => {
                if(err) {
                    throw new Error(err);
                }
            }
            );

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
        const user = await User.findOne({
            where: {email: forgotPasswordInput.email}
        });
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
                const user = await User.findOne({
                    where: {id: userId}
                });
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

    @Mutation(_return => UserMutationResponse, {nullable: true})
    async updateUser(
        @Arg('updateUserInput') updateUserInput: UpdateUIInput,
        @Ctx() ctx: MyContext
    ) : Promise<UserMutationResponse> {
        if((!ctx.req.session.userId) || ctx.req.session.role !== 'user') {
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
        const user = await User.findOne({
            where: {id: ctx.req.session.userId},
            relations: ["identification", "wallet"],
        });
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
            };
        }
        if(Object.keys(updateUserInput).length < 1) {
            return {
                code: 400,
                success: false,
                message: "No data to update",
                errors: [
                    {
                        field: 'updateUserInput',
                        message: 'No data to update'
                    }
                ]
            };
        }
        if(updateUserInput.identificationId && updateUserInput.identificationId !== user.identificationId
            && updateUserInput.issueDate && updateUserInput.issuedBy) {
            await Identification.update({id: user.identificationId}, {
                serial: updateUserInput.identificationId,
                issueDate: updateUserInput.issueDate,
                issuedBy: updateUserInput.issuedBy
            });
        }
        // const updatedUser = await User.createQueryBuilder().update({
        //     fullName: updateUserInput.fullName ? updateUserInput.fullName : user.fullName,
        //     avatarUrl: updateUserInput.avatarUrl ? updateUserInput.avatarUrl : user.avatarUrl,
        //     phoneNumber: updateUserInput.phoneNumber ? updateUserInput.phoneNumber : user.phoneNumber,
        //     address: updateUserInput.address ? updateUserInput.address : user.address,
        // })
        // .where({id: ctx.req.session.userId})
        // .returning('*')
        // .execute();
        updateUserInput.fullName ? user.fullName = updateUserInput.fullName : null;
        updateUserInput.avatarUrl ? user.avatarUrl = updateUserInput.avatarUrl : null;
        updateUserInput.phoneNumber ? user.phoneNumber = updateUserInput.phoneNumber : null;
        updateUserInput.address ? user.address = updateUserInput.address : null;
        await user.save();

        return {
            code: 200,
            success: true,
            message: "User updated successfully !",
            user
        }
    }

}