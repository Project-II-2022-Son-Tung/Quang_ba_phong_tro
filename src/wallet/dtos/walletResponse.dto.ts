import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Wallet } from '../wallet.model';

export class WalletResponseDto {
  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @Expose()
  @IsString()
  @IsOptional()
  message: string;

  @Expose()
  @IsOptional()
  @Type(() => Wallet)
  wallet?: Wallet;
}
