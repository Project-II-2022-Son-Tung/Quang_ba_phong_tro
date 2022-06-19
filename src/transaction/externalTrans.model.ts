import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { Transaction, TransactionModel } from './transaction.model';

export class ExternalTrans extends Transaction {
  @prop({ required: true, type: String })
  refference_code: string;
}

export const ExternalTransModel = getDiscriminatorModelForClass(
  TransactionModel,
  ExternalTrans,
  'EXTERNAL',
);
export type ExternalTransDocument = DocumentType<ExternalTrans>;
