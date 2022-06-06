import {
  DocumentType,
  getDiscriminatorModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';

import {
  Transaction,
  TransactionModel,
} from '../transaction/transaction.model';

@modelOptions({
  options: { allowMixed: 0 },
  schemaOptions: {
    discriminatorKey: 'type',
  },
})
export class ExternalTrans extends Transaction {
  @prop({
    required: true,
    type: String,
  })
  refference_code: string;
}

export const ExternalTransModel = getDiscriminatorModelForClass(
  TransactionModel,
  ExternalTrans,
  'internal_trans',
);
export type ExternalTransDocument = DocumentType<ExternalTrans>;
