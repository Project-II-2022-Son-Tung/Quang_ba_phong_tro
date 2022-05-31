import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { Product, ProductModel } from '../product/product.model';

export class ServiceProduct extends Product {
  @prop({ default: 0 })
  sold_time: number;

  @prop({ default: 0 })
  rate: number;

  @prop({ default: 0 })
  number_of_rate: number;
}

export type ServiceProductDocument = DocumentType<ServiceProduct>;
export const ServiceProductModel = getDiscriminatorModelForClass(
  ProductModel,
  ServiceProduct,
  'service',
);
