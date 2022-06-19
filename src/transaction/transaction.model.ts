import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Admin } from '../user/admin.model';
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
  })
  type?: TransactionType;

  @prop({ required: true, min: 0, default: 0 })
  ammount: number;

  @prop({ required: true, min: 0, default: 0 })
  fee: number;

  @prop({
    required: true,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @prop({ required: true, type: String })
  content: string;

  @prop({ required: false, type: Types.ObjectId, ref: () => Admin })
  admin_id?: Ref<Admin>;

  @prop({ required: true, type: Date, default: Date.now })
  transaction_time: Date;
}

export const TransactionModel = getModelForClass(Transaction);
export type TransactionDocument = DocumentType<Transaction>;
