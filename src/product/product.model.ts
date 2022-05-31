import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Category } from '../category/category.model';
import { SkillObjectOnDocuments } from '../user/skillObjectOnDocuments';
import { ProductProvidingMethod } from './product-providing-method.enum';
import { ProductStatus } from './product-status.enum';
import { ProductType } from './product-type.enum';
import { Client } from '../clients/client.model';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class Product {
  @prop({ required: true, type: Types.ObjectId, ref: () => Client})
  user_id: Ref<Client>;

  @prop({ required: true })
  name: string;

  @prop({ required: false, type: Types.ObjectId, ref: () => Category })
  category?: Ref<Category>[];

  @prop({ required: false })
  skill?: SkillObjectOnDocuments[];

  @prop({ required: false })
  description: string;

  @prop({ required: true, enum: ProductProvidingMethod, type: String })
  providing_method: ProductProvidingMethod[];

  @prop({ required: true })
  finish_estimated_time: number;

  @prop({ required: true })
  lower_bound_fee: number;

  @prop({ required: true })
  upper_bound_fee: number;

  @prop({ required: true, enum: ProductStatus })
  status: ProductStatus;

  @prop({ required: true, enum: ProductType })
  type: ProductType;

  @prop({ default: Date.now() })
  create_time: Date;
  
  @prop({ default: Date.now() })
  expiration_time: Date;

  @prop({ required: false })
  image: string[];
}

export type ProductDocument = DocumentType<Product>;
export const ProductModel = getModelForClass(Product);
