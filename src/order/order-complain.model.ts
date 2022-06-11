import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { Order } from './order.model';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class OrderComplain {
  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => Order,
  })
  order_id: Ref<Order>;

  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => User,
  })
  client_id: Ref<User>;

  @prop({ required: true, type: String })
  complain: string;

  @prop({ type: [String] })
  images: string[];

  @prop({ required: true, type: Date, default: Date.now })
  create_time: Date;
}

export const OrderComplainModel = getModelForClass(OrderComplain);
export type OrderComplainDocument = DocumentType<OrderComplain>;
