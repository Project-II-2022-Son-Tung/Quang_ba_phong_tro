import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Order } from '../order/order.model';
import { Transaction, TransactionModel } from './transaction.model';

export class InternalTrans extends Transaction {
  @prop({ required: true, type: Types.ObjectId, ref: () => Order })
  order_id: Ref<Order>;
}

export const InternalTransModel = getDiscriminatorModelForClass(
  TransactionModel,
  InternalTrans,
  'INTERNAL',
);
export type InternalTransDocument = DocumentType<InternalTrans>;
