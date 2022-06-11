import { DocumentType } from '@typegoose/typegoose';
import { UserType } from './user-type.enum';

export interface currentUserOnRedis {
  _id: string;
  email: string;
  type: UserType;
}
export type CurrentUserOnRedisDocument = DocumentType<currentUserOnRedis>;