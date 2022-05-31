import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { SocialMediaContact } from '../social-media-contact/social-media-contact.model';
import { Category } from '../category/category.model';
import { User, UserModel } from '../user/user.model';
import { SkillObjectOnDocuments } from '../user/skillObjectOnDocuments';

export class Client extends User {
  @prop()
  referal_code: string;

  @prop({ required: false, type: Types.ObjectId, ref: () => Category })
  category?: Ref<Category>[];

  @prop({ required: false })
  skill?: SkillObjectOnDocuments[];

  @prop({ default: 0 })
  successful_rate: number;

  @prop()
  introduction?: string;

  @prop({ default: 0 })
  sold_time: number;

  @prop({ default: 0 })
  rate_star: number;

  @prop({ default: 0 })
  rate_number: number;

  @prop({ _id: false })
  social_media_contact?: SocialMediaContact[];

  @prop()
  api_key: string;
}

export type ClientDocument = DocumentType<Client>;
export const ClientModel = getDiscriminatorModelForClass(
  UserModel,
  Client,
  'client',
);
