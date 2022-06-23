import {
  DocumentType,
  getDiscriminatorModelForClass,
} from '@typegoose/typegoose';
import { User, UserModel } from '../user/user.model';

export class Accountant extends User {}

export type AccountantDocument = DocumentType<Accountant>;
export const AccountantModel = getDiscriminatorModelForClass(
  UserModel,
  Accountant,
  'accountant',
);
