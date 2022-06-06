import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Wallet } from '../wallet/wallet.model';
import { TransactionDirection } from './transaction-direction';
import { TransactionStatus } from './transaction-status';
import { TransactionType } from './transaction-type.enum';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class Transaction {
  @prop({ required: true, type: Types.ObjectId, ref: () => Wallet })
  wallet_id: Ref<Wallet>;

  @prop({
    required: true,
    enum: TransactionDirection,
  })
  direction: TransactionDirection;

  @prop({
    required: true,
    enum: TransactionType,
    default: TransactionType.EXTERNAL,
  })
  type: TransactionType;

  @prop({ required: true, min: 0, default: 0 })
  ammount: number;

  @prop({ required: true, min: 0, default: 0 })
  fee: number;

  @prop({
    required: true,
    enum: TransactionStatus,
    default: TransactionStatus.CONFIRMED,
  })
  status: TransactionStatus;

  @prop({ required: true, type: String })
  content: string;

  @prop({ required: true, type: Date, default: Date.now })
  transaction_time: Date;
}

export const TransactionModel = getModelForClass(Transaction);
export type TransactionDocument = DocumentType<Transaction>;
