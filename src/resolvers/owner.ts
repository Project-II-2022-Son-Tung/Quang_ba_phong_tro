import { Owner } from "../entities/Owner";
import { Arg,  Ctx,  Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { OwnerMutationResponse } from "../types/OwnerMutationResponse";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/LoginInput";
import { MyContext } from "../types/MyContext";
import { ForgotPasswordInput } from "../types/ForgotPassword";
import { sendEmail } from "../utils/sendEmail";
import { TokenModel } from "../models/Token";
import { v4 as uuidv4} from "uuid"; 
import { ChangePasswordInput } from "../types/ChangePasswordInput";
import { OwnerRegisterInput } from "../types/OwnerRegisterInput";
import { Wallet } from "../entities/Wallet";
import { Identification } from "../entities/Identification";
import { UpdateUIInput } from "../types/UpdateUIInput";

@Resolver(_of => Owner)
export class OwnerResolver {

    @Query(_return => Owner, {nullable: true})
    async meOwner(
        @Ctx() ctx: MyContext
    ): Promise<Owner| undefined | null> {
        if((!ctx.req.session.userId) || ctx.req.session.role !== 'owner') {
            return null;
        }
        const owner = await Owner.findOne({
            where: {
                id: ctx.req.session.userId
            },
            relations: ["identification", "wallet"],
        });
        return owner;

    }


    @Mutation(_return => OwnerMutationResponse)
    async registerOwner(
        @Arg("registerInput") registerInput: OwnerRegisterInput,
        @Ctx() myContext: MyContext
    ) : Promise<OwnerMutationResponse> {
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
                const existingOwner = await transactionEntityManager.findOne(Owner, {where: [{email}, {username}]});
                if (existingOwner) {
                    return {
                        code: 400,
                        success: false,
                        message: "Owner already exists",
                        errors: [
                            {
                                field: existingOwner.username === username ? 'username' : 'email', 
                                message: `${ existingOwner.username === username ? 'Ownername' : 'Email'} already exists`
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

                const newOwner = transactionEntityManager.create(Owner,{
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
                    if(err) {
                        throw new Error(err);
                    }
                }
                );
                return {
                    code: 200,
                    success: true,
                    message: "Owner registration successfully",
                    owner: newOwner
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

    @Mutation(_return => OwnerMutationResponse)
    async loginOwner(
        @Arg('loginInput') loginInput: LoginInput,
        @Ctx() myContext: MyContext
        )
     : Promise<OwnerMutationResponse>{
        const {usernameOrEmail, password} = loginInput;
        try{
            // const existingOwner = await Owner.findOne({
            //     where: usernameOrEmail.includes("@") ? {email: usernameOrEmail} : {username: usernameOrEmail},
            // });
            const existingOwner = await myContext.connection.getRepository(Owner)
                .createQueryBuilder("owner")
                .where(usernameOrEmail.includes("@") ? "owner.email = :email" : "owner.username = :username", {
                    email: usernameOrEmail,
                    username: usernameOrEmail,
                })
                .addSelect("owner.password")
                .getOne();
            if(!existingOwner) {
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
                }
            }
            const validPassword = await argon2.verify(existingOwner.password, password);
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
            myContext.req.session.userId = existingOwner.id;
            myContext.req.session.name = existingOwner.fullName;
            myContext.req.session.role = 'owner';
            myContext.req.session.save(err => {
                if(err) {
                    throw new Error(err);
                }
            }
            );

            return{
                code: 200,
                success: true,
                message: "Owner login successfully",
                owner: existingOwner
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
    async forgotPasswordOwner(
        @Arg("forgotPasswordInput") forgotPasswordInput: ForgotPasswordInput
    ) : Promise<boolean> {
        const owner = await Owner.findOne({
            where: {email: forgotPasswordInput.email}
        });
        if(!owner) {
            return false;
        }
        
        await TokenModel.findOneAndDelete({userId: owner.id})
        const resetToken = uuidv4();
        const hashedResetToken = await argon2.hash(resetToken);



        await new TokenModel({
            userId: owner.id,
            token: hashedResetToken
        }).save();



        await sendEmail(forgotPasswordInput.email, `<a href="http://localhost:3000/change-password?token=${resetToken}&userId=${owner.id}">Click here to reset your password</a>`);
        return true;
    }

    @Mutation(_return => OwnerMutationResponse)
    async changePasswordOwner(
        @Ctx() ctx: MyContext,
        @Arg('token') token: string,
        @Arg('userId') userId: string,
        @Arg('changePasswordInput') changePasswordInput: ChangePasswordInput
    ): Promise<OwnerMutationResponse>{
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
                const owner = await Owner.findOne({
                    where: {id: userId}
                });
                if(!owner) {
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
                    }
                }
                const updatedPassword = await argon2.hash(changePasswordInput.newPassword);
                await Owner.update({id: userId}, {password: updatedPassword});
                await resePasswordToken.deleteOne();
                ctx.req.session.userId = owner.id;
                return {
                    code: 200,
                    success: true,
                    message: "Password successfully changed",
                    owner
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

    @Mutation(_return => OwnerMutationResponse, {nullable: true})
    async updateOwner(
        @Arg('updateOwnerInput') updateOwnerInput: UpdateUIInput,
        @Ctx() ctx: MyContext
    ) : Promise<OwnerMutationResponse> {
        if((!ctx.req.session.userId) || ctx.req.session.role !== 'owner') {
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
        const owner = await Owner.findOne({
            where: {id: ctx.req.session.userId},
            relations: ["identification", "wallet"],
        });
        if(!owner) {
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
        if(Object.keys(updateOwnerInput).length < 1) {
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
        if(updateOwnerInput.identificationId && updateOwnerInput.identificationId !== owner.identificationId
            && updateOwnerInput.issueDate && updateOwnerInput.issuedBy) {
            await Identification.update({id: owner.identificationId}, {
                serial: updateOwnerInput.identificationId,
                issueDate: updateOwnerInput.issueDate,
                issuedBy: updateOwnerInput.issuedBy
            });
        }
        // const updatedOwner = await Owner.createQueryBuilder().update({
        //     fullName: updateOwnerInput.fullName ? updateOwnerInput.fullName : owner.fullName,
        //     avatarUrl: updateOwnerInput.avatarUrl ? updateOwnerInput.avatarUrl : owner.avatarUrl,
        //     phoneNumber: updateOwnerInput.phoneNumber ? updateOwnerInput.phoneNumber : owner.phoneNumber,
        //     address: updateOwnerInput.address ? updateOwnerInput.address : owner.address,
        // })
        // .where({id: ctx.req.session.userId})
        // .returning('*')
        // .execute();
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
        }
    }
}