import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Category } from '../category/category.model';
import { User } from '../user/user.model';
import { NewsStatus } from './news-status.enum';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
      updatedAt: 'update_time',
    },
  },
})
export class News {
  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: false, type: Types.ObjectId, ref: () => Category })
  category?: Ref<Category>[];

  @prop({
    required: false,
    default: '',
  })
  title?: string;

  // TODO : change to default thumbnail image link
  @prop({ required: false, default: 'Undefined-thumbnail' })
  thumbnail: string;

  @prop({ required: true })
  content: string;

  @prop({ required: true, enum: NewsStatus })
  status: NewsStatus;

  @prop({ required: false, default: 1 })
  priority: number;

  @prop({ default: Date.now() })
  create_time: Date;
}

export type NewsDocument = DocumentType<News>;
export const NewsModel = getModelForClass(News);
