import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';
import { TransactionDirection } from '../transaction-direction';
import { TransactionType } from '../transaction-type.enum';

export class CreateTransactionDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  wallet_id: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  admin_id: string;

  @Expose()
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @Expose()
  @IsNotEmpty()
  @IsEnum(TransactionDirection)
  direction: TransactionDirection;

  @Expose()
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @Expose()
  @IsNotEmpty()
  @Min(0)
  fee: number;

  @Expose()
  @IsNotEmpty()
  content: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  order_id?: string;

  @Expose()
  @IsOptional()
  refference_code?: string;
}
