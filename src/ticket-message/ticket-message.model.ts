import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { Ticket } from '../ticket/ticket.model';

export class Ticket_Message {
  @prop({ required: true, type: Types.ObjectId, ref: () => Ticket })
  ticket_id: Ref<Ticket>;

  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true })
  content: string;

  @prop({ required: false })
  attachment: string;

  @prop({ type: Date, required: true })
  create_time: Date;
}
export type Ticket_MessageDocument = DocumentType<Ticket_Message>;
export const Ticket_MessageModel = getModelForClass(Ticket_Message);
