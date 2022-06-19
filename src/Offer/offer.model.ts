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
import { OfferStatus } from './offer-status';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class Offer {
  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => Client,
  })
  provider_id: Ref<Client>;

  @prop({
    required: true,
    type: Types.ObjectId,
    ref: () => Product,
  })
  job_id: Ref<Product>;

  @prop({ required: true, type: Number })
  offer_price: number;

  @prop({
    required: true,
    enum: OfferStatus,
    default: OfferStatus.PENDING,
  })
  status: OfferStatus;

  @prop({ required: true, type: String })
  introduction: string;

  @prop({ required: true, type: Number })
  offer_finish_estimated_time: number;

  @prop({ required: true, type: Date, default: Date.now })
  create_time: Date;
}

export const OfferModel = getModelForClass(Offer);
export type OfferDocument = DocumentType<Offer>;
