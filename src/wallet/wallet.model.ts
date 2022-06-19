import {
  DocumentType,
  modelOptions,
  prop,
  Ref,
  plugin,
  getModelForClass,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { User } from '../user/user.model';
import { WalletStatus } from './wallet-status.enum';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
@plugin(mongooseUniqueValidator)
export class Wallet {
  @prop({ required: true, unique: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, min: 0, default: 0 })
  balance: number;

  @prop({ required: true, min: 0, default: 0 })
  available_balance: number;

  @prop({ required: true, enum: WalletStatus, default: WalletStatus.NEW })
  status: WalletStatus;

  @prop({ required: true, type: Date, default: Date.now })
  create_time: Date;
}

export const WalletModel = getModelForClass(Wallet);
export type WalletDocument = DocumentType<Wallet>;
