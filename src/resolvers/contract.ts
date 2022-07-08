import { Contract } from "../entities/Contract";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";
import { ContractMutationResponse } from "../types/ContractMutationResponse";
import { CreateContractInput } from "../types/CreateContractInput";
import { Room } from "../entities/Room";
import { User } from "../entities/User";

@Resolver(_of => Contract)
export class ContractResolver {
    
    @Query(_return => [Contract], {nullable: true})
    async myContracts (
        @Ctx() ctx: MyContext,
    ): Promise<Contract[] | null> {
        if(!ctx.req.session.userId) {
            return null;
        }
        if(ctx.req.session.role === "user") {
            return await Contract.find({
                where: {
                    userId: ctx.req.session.userId,
                },
                relations: ["room", "owner"]
            });
        }
        if(ctx.req.session.role === "owner") {
            return await Contract.find({
                where: {
                    ownerId: ctx.req.session.userId,
                },
                relations: ["room", "user"]
            });
        }
        return null;
    }

    @Query(_return => ContractMutationResponse)
    async contract (
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
    ): Promise<ContractMutationResponse> {
        if(!ctx.req.session.userId) {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to view contract"
            }
        }
        let contract: Contract | null = null;
        if(ctx.req.session.role === "admin") {
            contract = await Contract.findOne({
                where: {
                    id,
                },
                relations: ["room", "owner", "user"]
            });
        }
        if(ctx.req.session.role === "user") {
            contract = await Contract.findOne({
                where: {
                    id,
                    userId: ctx.req.session.userId,
                },
                relations: ["room", "owner"]
            });
        }
        if(ctx.req.session.role === "owner") {
            contract = await Contract.findOne({
                where: {
                    id,
                    ownerId: ctx.req.session.userId,
                },
                relations: ["room", "user"]
            });
        }
        if (!contract) {
            return {
                code: 400,
                success: false,
                message: "Contract not found"
            }
        }
        return {
            code: 200,
            success: true,
            contract,
            message: "Successfully found contract"
        }
    }

    @Mutation(_return => ContractMutationResponse)
    async createContract (
        @Arg("contractInput") contractInput: CreateContractInput,
        @Ctx() ctx: MyContext,
    ): Promise<ContractMutationResponse> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "owner") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to create contract"
            }
        }
        const room = await Room.findOne({
            where: {
                id: contractInput.roomId,
            }
        });
        if ((!room) || (room.ownerId !== ctx.req.session.userId)) {
            return {
                code: 400,
                success: false,
                message: "Room not found or you are not the owner"
            }
        }
        const user = await User.findOne({
            where: {
                id: contractInput.userId,
            }
        });
        if (!user) {
            return {
                code: 400,
                success: false,
                message: "User not found"
            }
        }
        const contractDuration = new Date();
        contractDuration.setMonth(contractDuration.getMonth() + contractInput.contractMonths);
        const contract = await Contract.create({
            roomId: contractInput.roomId,
            ownerId: ctx.req.session.userId,
            userId: contractInput.userId,
            leasePrice: contractInput.leasePrice ? contractInput.leasePrice : room.price,
            deposit: contractInput.deposit,
            address: contractInput.detailAddress,
            contractDuration,
            additionalAgreements: contractInput.additionalAgreements,
            contractFee: 0,
        }).save();
        return {
            code: 200,
            success: true,
            contract,
            message: "Successfully created contract"
        }
    }

    @Mutation(_return => ContractMutationResponse)
    async acceptContract (
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
    ): Promise<ContractMutationResponse> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "user") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to accept contract"
            }
        }
        const connection = ctx.connection;
        return await connection.transaction(async transactionEntityManager =>{
            const contract = await transactionEntityManager.findOne(Contract, {
                where: {
                    id,
                },
                relations: ["room", "owner", "user"]
            });
            if (!contract) {
                return {
                    code: 400,
                    success: false,
                    message: "Contract not found"
                }
            }
            if(contract.userId !== ctx.req.session.userId) {
                return {
                    code: 400,
                    success: false,
                    message: "You are not the user of this contract"
                }
            }
            if(contract.status != "pending") {
                return {
                    code: 400,
                    success: false,
                    message: "Contract is not pending"
                }
            }
            contract.status = "succeeded";
            await transactionEntityManager.save(contract);
            return {
                code: 200,
                success: true,
                contract,
                message: "Successfully accepted contract"
            }
        });
        
    }

    @Mutation(_return => ContractMutationResponse)
    async rejectContract (
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
    ): Promise<ContractMutationResponse> {
        if(!ctx.req.session.userId || ctx.req.session.role !== "user") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to reject contract"
            }
        }
        const contract = await Contract.findOne({
            where: {
                id,
            },
            relations: ["room", "owner"]
        });
        if (!contract) {
            return {
                code: 400,
                success: false,
                message: "Contract not found"
            }
        }
        if (contract.userId !== ctx.req.session.userId) {
            return {
                code: 400,
                success: false,
                message: "You are not the user"
            }
        }
        if (contract.status != "pending") {
            return {
                code: 400,
                success: false,
                message: "Contract is not pending"
            }
        }
        contract.status = "canceled";
        await contract.save();
        return {
            code: 200,
            success: true,
            contract,
            message: "Successfully rejected contract"
        }
    }

}