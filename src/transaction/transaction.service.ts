import { startSession } from 'mongoose';
import { OrderModel } from '../order/order.model';
import { WalletModel } from '../wallet/wallet.model';
import { ExternalTransDocument } from './externalTrans.model';
import {
  InternalTransDocument,
  InternalTransModel,
} from './internalTrans.model';
import { TransactionDirection } from './transaction-direction';
import { TransactionStatus } from './transaction-status';
import { TransactionDocument } from './transaction.model';
import { TransactionRepository } from './transaction.repository';

export class TransactionService {
  private readonly transactionRepository = new TransactionRepository();

  async getInternalTransactions(
    user_id: string,
    page: number,
    limit: number,
    select: string,
  ): Promise<InternalTransDocument[] | null> {
    const selectQuery = {};
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
    }
    const wallet = await WalletModel.findOne({ user_id });
    if (!wallet) return null;
    return this.transactionRepository.getInternalTransactions(
      page,
      limit,
      { wallet_id: wallet._id },
      selectQuery,
    );
  }

  async getExternalTransactions(
    user_id: string,
    page: number,
    limit: number,
    select: string,
  ): Promise<ExternalTransDocument[] | null> {
    const selectQuery = {};
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
    }
    const wallet = await WalletModel.findOne({ user_id });
    if (!wallet) return null;
    return this.transactionRepository.getExternalTransactions(
      page,
      limit,
      { wallet_id: wallet._id },
      selectQuery,
    );
  }

  async getTransactions(
    user_type: string,
    page: number,
    limit: number,
    select: string,
  ): Promise<TransactionDocument[] | null> {
    if (user_type !== 'admin') {
      throw new Error('You are not authorized to perform this action');
    }
    const selectQuery = {};
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
    }
    return this.transactionRepository.getTransactions(
      page,
      limit,
      {},
      selectQuery,
    );
  }

  async getTransactionById(
    user_type: string,
    user_id: string,
    transaction_id: string,
  ): Promise<TransactionDocument | null> {
    if (user_type === 'admin') {
      return this.transactionRepository.getTransactionById(transaction_id);
    }
    const wallet = await WalletModel.findOne({ user_id });
    const transaction = await this.transactionRepository.getTransactionById(
      transaction_id,
    );
    if (transaction.wallet_id.toString() !== wallet._id.toString()) {
      throw new Error('You are not authorized to perform this action');
    }
    return transaction;
  }

  async getTransactionsByOrderId(
    user_type: string,
    user_id: string,
    order_id: string,
  ): Promise<InternalTransDocument[] | null> {
    if (user_type === 'admin') {
      return this.transactionRepository.getTransactionsByOrderId(order_id);
    }
    const wallet = await WalletModel.findOne({ user_id });
    const transactions = (await InternalTransModel.find({
      order_id,
      wallet_id: wallet.id,
    }).lean()) as InternalTransDocument[];
    return transactions;
  }

  async acceptTransaction(
    user_type: string,
    userId: string,
    transaction_id: string,
  ): Promise<InternalTransDocument | null> {
    if (user_type !== 'admin') {
      throw new Error('You are not authorized to perform this action');
    }
    const session = await startSession();
    session.startTransaction();
    try {
      const transaction = await InternalTransModel.findById(
        transaction_id,
      ).session(session);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      if (transaction.status !== TransactionStatus.PENDING) {
        throw new Error('Transaction already accepted');
      }
      await InternalTransModel.updateOne(
        { _id: transaction_id },
        { status: TransactionStatus.CONFIRMED, admin_id: userId },
        { session },
      );
      const wallet = await WalletModel.findByIdAndUpdate(
        transaction.wallet_id,
        { $inc: { balance: -transaction.ammount } },
        { session },
      );
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      const order = await OrderModel.findById(transaction.order_id).session(
        session,
      );
      if (!order) {
        throw new Error('Order not found');
      }
      const provider_wallet = await WalletModel.findOneAndUpdate(
        { user_id: order.provider_id },
        {
          $inc: {
            balance: transaction.ammount - transaction.fee,
            available_balance: transaction.ammount - transaction.fee,
          },
        },
        { session },
      );
      if (!provider_wallet) {
        throw new Error('Provider wallet not found');
      }
      const newTransaction = await InternalTransModel.create(
        [
          {
            admin_id: userId,
            wallet_id: provider_wallet._id,
            ammount: transaction.ammount,
            direction: TransactionDirection.IN,
            fee: transaction.fee,
            order_id: transaction.order_id,
            status: TransactionStatus.CONFIRMED,
            content: `Thanh toan don hang ${transaction.order_id} voi so Bi: ${
              transaction.ammount
            } - Phi giao dich: ${transaction.fee} Bi. Thoi gian: ${new Date()}`,
          },
        ],
        { session },
      );
      if (!newTransaction) throw new Error('Transaction not created');
      // const newInternalTransaction = await InternalTransModel.findById(
      //   newTransaction[0]._id,
      //   { session },
      // );
      await session.commitTransaction();
      session.endSession();
      return newTransaction[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
