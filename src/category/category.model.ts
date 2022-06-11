/* eslint-disable object-shorthand */
/* eslint-disable func-names */
import {
  DocumentType,
  getModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { toSlugConverter } from '../helper/toSlugConverter';

export class Category {
  @prop({ required: true })
  name: string;

  @prop({
    default: function (this: DocumentType<Category>) {
      return `${toSlugConverter(this.name)}`;
    },
  })
  slug: string;

  @prop({ required: false })
  description: string;

  @prop({ required: false })
  image: string;

  @prop({ type: Types.ObjectId, ref: () => Category })
  parent_category: Ref<Category>;
}

export type CategoryDocument = DocumentType<Category>;
export const CategoryModel = getModelForClass(Category);