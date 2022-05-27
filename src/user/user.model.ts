import {
  getModelForClass,
  modelOptions,
  plugin,
  prop,
  DocumentType,
} from '@typegoose/typegoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { UserSex } from './user-sex.enum';
import { UserStatus } from './user-status.enum';
import { UserType } from './user-type.enum';

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
@plugin(mongooseUniqueValidator)
export class User {
  @prop()
  fullname: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  phone: string;

  @prop()
  avatar: string;

  @prop({ required: true, select: false })
  hashed_password?: string;

  @prop()
  birthday: Date;

  @prop()
  address: string;

  @prop({ required: false, enum: UserSex })
  sex?: UserSex;

  @prop({ required: true, enum: UserType })
  type?: UserType;

  @prop({ required: true, enum: UserStatus, default: UserStatus.NEW })
  status: UserStatus;

  @prop({ required: true, select: false, default: false })
  del_flag: boolean;

  @prop({ required: true })
  create_time: Date;

  @prop({ required: true, select: false })
  active_token: string;

  @prop({ required: true, select: false })
  api_key: string;
}
export type UserDocument = DocumentType<User>;
export const UserModel = getModelForClass(User);
export const UserModelUnselectableFields = [
  'hashed_password',
  'del_flag',
  'active_token',
  'api_key',
];
