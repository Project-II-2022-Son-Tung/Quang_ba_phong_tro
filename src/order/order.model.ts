import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Product } from '../product/product.model';
import { Client } from '../clients/client.model';
import { OrderStatus } from './order-status';
import { OrderType } from './order-type';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class Order {
  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => Client,
  })
  provider_id: Ref<Client>;

  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => Client,
  })
  client_id: Ref<Client>;

  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => Product,
  })
  product_id: Ref<Product>;

  @prop({ required: true, enum: OrderType })
  type: OrderType;

  @prop({ required: true, type: Number })
  price: number;

  @prop({
    required: true,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @prop({ required: true, type: String })
  note: string;

  @prop({ required: true, type: Number })
  estimated_time: number;

  @prop({ required: true, type: Date, default: Date.now })
  create_time: Date;
}

export const OrderModel = getModelForClass(Order);
export type OrderDocument = DocumentType<Order>;
