import { Contract, StatusContractEnum } from "../entities/Contract";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types/MyContext";
import { ContractMutationResponse } from "../types/ContractMutationResponse";
import { CreateContractInput } from "../types/CreateContractInput";
import { Room } from "../entities/Room";
import { User } from "../entities/User";
import { Wallet, WalletStatus } from "../entities/Wallet";
import { Transaction, TransactionDirectionEnum, TransactionStatusEnum, TransactionTypeEnum } from "../entities/Transaction";
import { Owner } from "../entities/Owner";
import { Invite, iStatus } from "../entities/Invite";
import { ListContractResponse } from "../types/ListContractResponse";
import { FindOptionsWhere } from "typeorm";

@Resolver(_of => Contract)
export class ContractResolver {
    
    @Query(_return => ListContractResponse, {nullable: true})
    async myContracts (
        @Arg("status", {nullable: true}) status: StatusContractEnum,
        @Arg("page") page: number,
        @Arg("limit") limit: number,
        @Ctx() ctx: MyContext,
    ): Promise<ListContractResponse> {
        if(!ctx.req.session.userId) {
            return {
                totalPages: 0,
                contracts: [],
            }
        }
        const realLimit = Math.min(limit, 20);
        if(ctx.req.session.role === "user") {
            let whereFilter: FindOptionsWhere<Contract> | FindOptionsWhere<Contract>[] = {
                userId: ctx.req.session.userId,
            }
            if(status) {
                whereFilter = {
                    ...whereFilter,
                    status,
                }
            }
            const contracts = await Contract.find({
                where: whereFilter,
                skip: (page - 1) * realLimit,
                take: realLimit,
                relations: ["room", "owner"]
            });
            const total = await Contract.count({
                where: {
                    userId: ctx.req.session.userId,
                },
            });
            const totalPages = Math.ceil(total / realLimit);
            return {
                totalPages,
                contracts,
            }
        }
        if(ctx.req.session.role === "owner") {
            let whereFilter: FindOptionsWhere<Contract> | FindOptionsWhere<Contract>[] = {
                ownerId: ctx.req.session.userId,
            }
            if(status) {
                whereFilter = {
                    ...whereFilter,
                    status,
                }
            }
            const contracts = await Contract.find({
                where: whereFilter,
                skip: (page - 1) * realLimit,
                take: realLimit,
                relations: ["room", "user"]
            });
            const total = await Contract.count({
                where: {
                    ownerId: ctx.req.session.userId,
                },
            });
            const totalPages = Math.ceil(total / realLimit);
            return {
                totalPages,
                contracts,
            }
        }
        return {
            totalPages: 0,
            contracts: [],
        };
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
                relations: ["room", "owner", "user", "owner.identification", "user.identification", "room.province", "room.district", "room.ward"]
            });
        }
        if(ctx.req.session.role === "user") {
            contract = await Contract.findOne({
                where: {
                    id,
                    userId: ctx.req.session.userId,
                },
                relations: ["room", "owner", "user", "user.identification", "owner.identification", "room.province", "room.district", "room.ward"]
            });
        }
        if(ctx.req.session.role === "owner") {
            contract = await Contract.findOne({
                where: {
                    id,
                    ownerId: ctx.req.session.userId,
                },
                relations: ["room", "user", "owner", "user.identification", "owner.identification", "room.province", "room.district", "room.ward"]
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

        const owner = await Owner.findOne({
            where: {
                id: ctx.req.session.userId,
            }, relations: ["wallet"]
        });

        if(!owner) {
            return {
                code: 400,
                success: false,
                message: "Owner not found"
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

        const invite = await Invite.findOne({
            where: {
                roomId: room.id,
                userId: user.id,
            }
        });

        if ((!invite) || (invite.status !== iStatus.ACCEPTED)) {
            return {
                code: 400,
                success: false,
                message: "User is not invited to view this room or did not accept the invitation"
            }
        }

        if(owner.wallet.status === WalletStatus.LOCKED){
            return {
                code: 400,
                success: false,
                message: "Wallet is locked"
            }
        }

        const contractDuration = new Date();
        contractDuration.setMonth(contractDuration.getMonth() + contractInput.contractMonths);
        const connection = ctx.connection;
        return await connection.transaction(async transactionEntityManager =>{

            const contract = transactionEntityManager.create(Contract, {
                roomId: contractInput.roomId,
                userId: contractInput.userId,
                ownerId: ctx.req.session.userId,
                status: StatusContractEnum.PENDING,
                contractDuration,
                additionalAgreements: contractInput.additionalAgreements,
                deposit: contractInput.deposit,
                leasePrice: contractInput.leasePrice ? contractInput.leasePrice : room.price,
                address: contractInput.detailAddress,
                contractFee: Math.min(room.price / 100, 100000),
                
            });
            await transactionEntityManager.save(contract);

            return {
                code: 200,
                success: true,
                contract,
                message: "Successfully created contract"
            }
        });

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
            try{
                const contract = await transactionEntityManager.findOne(Contract, {
                    where: {
                        id,
                    },
                    relations: ["room", "owner", "user", "owner.wallet", "user.wallet"]
                });
    
                if (!contract) {
                    throw new Error("Contract not found");
                }
    
                if(contract.userId !== ctx.req.session.userId) {
                    throw new Error("You are not the user of this contract");
                }
                if(contract.status != StatusContractEnum.PENDING) {
                    throw new Error("Contract is not pending");
                }
    
                if( contract.user.wallet.status === WalletStatus.LOCKED){
                    throw new Error("Wallet is locked");
                }
    
                if( contract.owner.wallet.status === WalletStatus.LOCKED){
                    throw new Error("Wallet of owner is locked");
                }

                if(contract.leasePrice > contract.user.wallet.availableBalance) {
                    throw new Error("Your wallet does not have enough available balance");
                }
    
                await transactionEntityManager.decrement(Wallet, {
                    id: contract.user.wallet.id,
                }, "availableBalance", contract.deposit);
    
                await transactionEntityManager.decrement(Wallet, {
                    id: contract.user.wallet.id,
                }, "balance", contract.deposit);
    
                const content = `Lam hop dong thue phong: ${contract.room.id}. Id nguoi cho thue: ${contract.owner.id}. Id nguoi thue: ${contract.user.id}`;
    
                await transactionEntityManager.create(Transaction, {
                    wallet: contract.user.wallet,
                    amount: contract.deposit,
                    type: TransactionTypeEnum.INTERNAL,
                    content,
                    direction: TransactionDirectionEnum.OUT,
                    room: contract.room,
                    status: TransactionStatusEnum.COMPLETED
    
                }).save();
    
                const finalMoney = Math.max((contract.deposit - contract.contractFee), 0);
    
                await transactionEntityManager.increment(Wallet, {
                    id: contract.owner.wallet.id,
                }, "availableBalance", finalMoney);
    
                await transactionEntityManager.increment(Wallet, {
                    id: contract.owner.wallet.id,
                }, "balance", finalMoney);
    
                await transactionEntityManager.create(Transaction,{
                    wallet: contract.owner.wallet,
                    amount: finalMoney,
                    type: TransactionTypeEnum.INTERNAL,
                    content,
                    direction: TransactionDirectionEnum.IN,
                    room: contract.room,
                    status: TransactionStatusEnum.COMPLETED
                }).save()
    
                contract.status = StatusContractEnum.SUCCEEDED;
                await transactionEntityManager.save(contract);
                return {
                    code: 200,
                    success: true,
                    contract,
                    message: "Successfully accepted contract"
                }

            }
            catch(err){
                return {
                    code: 400,
                    success: false,
                    message: err.message
                }
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
        if (contract.status != StatusContractEnum.PENDING) {
            return {
                code: 400,
                success: false,
                message: "Contract is not pending"
            }
        }
        contract.status = StatusContractEnum.CANCELED;
        await contract.save();
        return {
            code: 200,
            success: true,
            contract,
            message: "Successfully rejected contract"
        }
    }

}