import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { Product, ProductModel } from '../product/product.model';
import { JobPaymentMethod } from './enums/job-payment-method.enum';
import { JobRequiredLevel } from './enums/job-required-level.enum';

export class JobProduct extends Product {
  @prop({ required: true, enum: JobRequiredLevel, type: String })
  required_level: JobRequiredLevel[];

  @prop({ required: true, enum: JobPaymentMethod, type: String })
  payment_method: JobPaymentMethod;
}

export type JobProductDocument = DocumentType<JobProduct>;
export const JobProductModel = getDiscriminatorModelForClass(
  ProductModel,
  JobProduct,
  'job',
);
