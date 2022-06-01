import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

export class AdminConfig {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  value: number;
}

export const AdminConfigModel = getModelForClass(AdminConfig);
export type AdminConfigDocument = DocumentType<AdminConfig>;
