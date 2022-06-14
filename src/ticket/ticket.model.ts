import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { TicketStatus } from './ticket-status.enum';

export class Ticket {
  @prop({ required: true })
  ticket_id: string;

  @prop({ required: true, type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  type: string;

  @prop({ required: true })
  object: string;

  @prop({ required: true })
  content: string;

  @prop({ required: false })
  attachment: string;

  @prop({ required: true, enum: TicketStatus })
  status: TicketStatus;

  @prop({ type: Date, required: true })
  create_time: Date;

  @prop({ type: Date, required: true })
  last_reply: Date;

  @prop({ type: Date, required: false })
  close_time: Date;
}
export type TicketDocument = DocumentType<Ticket>;
export const TicketModel = getModelForClass(Ticket);
