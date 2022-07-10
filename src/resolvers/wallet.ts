import { Wallet, WalletStatus } from "../entities/Wallet";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { WalletMutationResponse } from "../types/WalletMutationResponse";
import { MyContext } from "../types/MyContext";
import { Transaction, TransactionDirectionEnum, TransactionStatusEnum, TransactionTypeEnum } from "../entities/Transaction";
import { DepositInput } from "../types/DepositInput";
import { WithdrawInput } from "../types/WithdrawInput";

@Resolver(_of => Wallet)
export class WalletResolver {

    @Query(_return => Wallet, { nullable: true })
    public async getWallet(id: string): Promise<Wallet | null> {
        return await Wallet.findOne({
            where: {
                id
            }
        });
    }

    @Mutation(_return => WalletMutationResponse)
    public async lockWallet(
        id: string,
        @Ctx() ctx: MyContext
    ): Promise<WalletMutationResponse> {
        if(!ctx.req.session!.userId || ctx.req.session.role !== "admin") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to lock wallet"
            }
        }
        const wallet = await Wallet.update(
            { id },
            { status: WalletStatus.LOCKED }
        );

        if (!wallet){
            return {
                code: 404,
                success: false,
                message: "Wallet not found"
            }
        }

        return {
            code: 200,
            success: true,
            message: "Wallet locked"
        }
        
    }

    @Mutation(_return => WalletMutationResponse)
    public async unlockWallet(
        id: string,
        @Ctx() ctx: MyContext
    ): Promise<WalletMutationResponse> {
        if(!ctx.req.session!.userId || ctx.req.session.role !== "admin") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to unlock wallet"
            }
        }
        const wallet = await Wallet.update(
            { id },
            { status: WalletStatus.ACTIVE }
        );

        if (!wallet){
            return {
                code: 404,
                success: false,
                message: "Wallet not found"
            }
        }

        return {
            code: 200,
            success: true,
            message: "Wallet unlocked"
        }
        
    }

    @Mutation(_return => WalletMutationResponse)
    public async deposit(
        @Arg("depositInput") depositInput: DepositInput,
        @Ctx() ctx: MyContext
    ): Promise<WalletMutationResponse> {
        if(!ctx.req.session!.userId || ctx.req.session.role !== "admin") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to deposit"
            }
        }
        const connection = ctx.connection;
        return await connection.transaction(async (transactionEntityManager) => {
            try{
                const wallet = await transactionEntityManager.findOne(Wallet, {
                    where: {
                        id: depositInput.id
                    }
                });
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                const newBalance = wallet.balance + depositInput.amount;
                const newAvailableBalance = wallet.availableBalance + depositInput.amount;
                const updatedWallet = await transactionEntityManager.update(Wallet, {
                    id: depositInput.id
                }, {
                    balance: newBalance,
                    availableBalance: newAvailableBalance
                });
                if (!updatedWallet) {
                    throw new Error("Wallet not found");
                }

                const transaction = await transactionEntityManager.save(Transaction, {
                    wallet,
                    amount: depositInput.amount,
                    content: `Nap tien vao vi: ${depositInput.id}. So tien: ${depositInput.amount}.`,
                    type: TransactionTypeEnum.EXTERNAL,
                    direction: TransactionDirectionEnum.IN,
                    status: TransactionStatusEnum.COMPLETED,
                    adminId: ctx.req.session!.userId,
                    referenceId: depositInput.referenceId
                });

                if (!transaction) {
                    throw new Error("Transaction not found");
                }

                return {
                    code: 200,
                    success: true,
                    message: "Deposit success"
                }
            } catch(err) {
                return {
                    code: 400,
                    success: false,
                    message: "Error while depositing",
                    errors: [
                        {
                            field: "error",
                            message: err.message
                        }
                    ]
                }
            }
        });
        
    }

    @Mutation(_return => WalletMutationResponse)
    public async withdraw(
        @Arg("withdrawInput") withdrawInput: WithdrawInput,
        @Ctx() ctx: MyContext
    ): Promise<WalletMutationResponse> {
        if(!ctx.req.session!.userId || (ctx.req.session.role !== "user" && ctx.req.session.role !== "owner")) {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to withdraw"
            }
        }
        const connection = ctx.connection;
        return await connection.transaction(async (transactionEntityManager) => {
            try{
                const wallet = await transactionEntityManager.findOne(Wallet, {
                    where: {
                        id: withdrawInput.id
                    }
                });
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                if(wallet.availableBalance < withdrawInput.amount) {
                    throw new Error("Not enough balance");
                }
                const newAvailableBalance = wallet.availableBalance - withdrawInput.amount;
                const updatedWallet = await transactionEntityManager.update(Wallet, {
                    id: withdrawInput.id
                }, {
                    availableBalance: newAvailableBalance
                });
                if (!updatedWallet) {
                    throw new Error("Wallet not found");
                }

                const transaction = await transactionEntityManager.save(Transaction, {
                    wallet,
                    amount: withdrawInput.amount,
                    content: `Rut tien ra tu vi: ${withdrawInput.id}. So tien: ${withdrawInput.amount}. Ngan hang: ${withdrawInput.bankName}. So tai khoan: ${withdrawInput.accountName}.`,
                    type: TransactionTypeEnum.EXTERNAL,
                    direction: TransactionDirectionEnum.OUT,
                });

                if (!transaction) {
                    throw new Error("Transaction not found");
                }

                return {
                    code: 200,
                    success: true,
                    message: "Withdraw success"
                }
            } catch(err) {
                return {
                    code: 400,
                    success: false,
                    message: "Error while withdrawing",
                    errors: [
                        {
                            field: "error",
                            message: err.message
                        }
                    ]
                }
            }
        });
        
    }

    @Mutation(_return => WalletMutationResponse)
    public async acceptWithdraw(
        @Arg("id") id: string,
        @Arg("referenceId") referenceId: string,
        @Ctx() ctx: MyContext
    ): Promise<WalletMutationResponse> {
        if(!ctx.req.session!.userId || ctx.req.session.role !== "admin") {
            return {
                code: 400,
                success: false,
                message: "You are not authorized to accept withdraw"
            }
        }
        const connection = ctx.connection;
        return await connection.transaction(async (transactionEntityManager) => {
            try{
                const transaction = await transactionEntityManager.findOne(Transaction, {
                    where: {
                        id
                    }
                });
                if (!transaction) {
                    throw new Error("Transaction not found");
                }
                if(transaction.status !== TransactionStatusEnum.PENDING) {
                    throw new Error("Transaction is not pending");
                }
                const updatedTransaction = await transactionEntityManager.update(Transaction, {
                    id
                }, {
                    status: TransactionStatusEnum.COMPLETED,
                    referenceId,
                    adminId: ctx.req.session!.userId
                });
                if (!updatedTransaction) {
                    throw new Error("Transaction not found");
                }

                const wallet = await transactionEntityManager.findOne(Wallet, {
                    where: {
                        id: transaction.walletId
                    }
                });
                if (!wallet) {
                    throw new Error("Wallet not found");
                }
                if(wallet.balance < transaction.amount) {
                    throw new Error("Not enough balance");
                }
                const newBalance = wallet.balance - transaction.amount;
                const updatedWallet = await transactionEntityManager.update(Wallet, {
                    id: transaction.walletId
                }, {
                    balance: newBalance,
                });
                if (!updatedWallet) {
                    throw new Error("Wallet not found");
                }

                return {
                    code: 200,
                    success: true,
                    message: "Withdraw accepted"
                }
            } catch(err) {
                return {
                    code: 400,
                    success: false,
                    message: "Error while accepting withdraw",
                    errors: [
                        {
                            field: "error",
                            message: err.message
                        }
                    ]
                }
            }
        });
    }

}