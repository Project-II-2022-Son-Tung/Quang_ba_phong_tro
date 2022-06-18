/* eslint-disable @typescript-eslint/ban-types */
import { CreateTransactionDto } from './dtos/CreateTransaction.dto';
import {
  ExternalTransDocument,
  ExternalTransModel,
} from './externalTrans.model';
import {
  InternalTransDocument,
  InternalTransModel,
} from './internalTrans.model';
import { TransactionType } from './transaction-type.enum';
import { TransactionDocument, TransactionModel } from './transaction.model';

export class TransactionRepository {
  async getTransactions(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<TransactionDocument[] | null> {
    if (Object.keys(query).length) {
      const transactions = await TransactionModel.find(query)
        .select(selectQuery)
        .skip(page * limit)
        .limit(limit)
        .lean();
      return transactions as TransactionDocument[];
    }
    return TransactionModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getInternalTransactions(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<InternalTransDocument[] | null> {
    return InternalTransModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getExternalTransactions(
    page: number,
    limit: number,
    query: {},
    selectQuery: {},
  ): Promise<ExternalTransDocument[] | null> {
    return ExternalTransModel.find(query)
      .select(selectQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async getTransactionById(id: string): Promise<TransactionDocument | null> {
    return TransactionModel.findOne({ _id: id }).lean();
  }

  async getTransactionsByOrderId(
    orderId: string,
  ): Promise<InternalTransDocument[] | null> {
    return InternalTransModel.find({ order_id: orderId }).lean();
  }

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<InternalTransDocument | ExternalTransDocument> {
    if (createTransactionDto.type === TransactionType.INTERNAL) {
      return InternalTransModel.create(createTransactionDto);
    }
    return ExternalTransModel.create(createTransactionDto);
  }

  async updateTransactionStatus(id: string, status: string): Promise<string> {
    return TransactionModel.findByIdAndUpdate(id, { status })
      .lean()
      .then(() => {
        return id;
      });
  }
}
