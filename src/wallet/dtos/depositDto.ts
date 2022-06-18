import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { DepositLocale } from '../deposit-locale.enum';
import { BankCode } from '../Bank-code.enum';

export class DepositDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(DepositLocale)
  locale: DepositLocale;

  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsNotEmpty()
  @IsIP()
  ipAddr: string;

  @IsOptional()
  @IsEnum(BankCode)
  bankCode?: BankCode;
}
