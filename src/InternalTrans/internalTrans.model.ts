import {
  DocumentType,
  getDiscriminatorModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Order } from '../order/order.model';
import { Admin } from '../user/admin.model';
import {
  Transaction,
  TransactionModel,
} from '../transaction/transaction.model';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class InternalTrans extends Transaction {
  @prop({ required: true, type: Types.ObjectId, ref: () => Order })
  order_id: Ref<Order>;

  @prop({ required: true, type: Types.ObjectId, ref: () => Order })
  admin_id: Ref<Admin>;
}

export const InternalTransModel = getDiscriminatorModelForClass(
  TransactionModel,
  InternalTrans,
  'internal_trans',
);
export type InternalTransDocument = DocumentType<InternalTrans>;
